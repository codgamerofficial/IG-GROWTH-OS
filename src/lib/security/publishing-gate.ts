// =============================================================================
// IG GrowthOS: Publishing Safety Gate & Verification
// =============================================================================

import { ContentItem } from '../supabase/types';
import { instagramService } from '../instagram/service';
import { repository } from '../supabase/repository';

export interface PublishingValidationResult {
  allowed: boolean;
  code?: string;
  reason?: string;
}

export class PublishingSafetyGate {
  /**
   * Enforces strict safety checks before any content item can be published.
   * A non-approved post MUST NEVER publish.
   */
  static validate(item: ContentItem, autonomousPublishing = false): PublishingValidationResult {
    // 1. Approval Gate Check
    if (!autonomousPublishing && item.approval_status !== 'APPROVED') {
      return {
        allowed: false,
        code: 'APPROVAL_GATE_REJECTION',
        reason: `CRITICAL SAFETY GATE: Content item "${item.title}" cannot be published because approval_status is '${item.approval_status}'. Status must be 'APPROVED'.`,
      };
    }

    // 2. Duplicate Publishing Prevention
    if (item.status === 'PUBLISHED' || item.instagram_media_id) {
      return {
        allowed: false,
        code: 'DUPLICATE_PUBLISH_DETECTED',
        reason: `Item is already published with Instagram Media ID ${item.instagram_media_id}. Duplicate publish prevented.`,
      };
    }

    if (item.status === 'PUBLISHING') {
      return {
        allowed: false,
        code: 'CONCURRENT_PUBLISH_DETECTED',
        reason: `Item is currently in 'PUBLISHING' state. Parallel operation prevented.`,
      };
    }

    // 3. Media verification
    if (!item.media_url && !item.thumbnail_url) {
      return {
        allowed: false,
        code: 'MISSING_MEDIA_URL',
        reason: `Publishing requires a valid media_url or thumbnail_url.`,
      };
    }

    // 4. Caption verification
    if (!item.caption || item.caption.trim().length === 0) {
      return {
        allowed: false,
        code: 'EMPTY_CAPTION',
        reason: `Publishing requires a non-empty caption.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Executes the official 12-step verified publishing flow.
   */
  static async publishVerified(
    contentId: string,
    autonomousPublishing = false
  ): Promise<{ success: boolean; instagram_media_id: string; message: string }> {
    const item = await repository.getContentItemById(contentId);
    if (!item) {
      throw new Error(`Content item ${contentId} not found.`);
    }

    // Step 1 - 4: Verify Safety Gate
    const validation = this.validate(item, autonomousPublishing);
    if (!validation.allowed) {
      await repository.logAudit({
        action: 'PUBLISH_BLOCKED_BY_SAFETY_GATE',
        resource_type: 'content_items',
        resource_id: contentId,
        metadata: { code: validation.code, reason: validation.reason },
      });
      throw new Error(validation.reason);
    }

    // Step 5: Mark status as PUBLISHING to lock against concurrency
    await repository.updateContentItem(contentId, { status: 'PUBLISHING' });

    try {
      // Step 6: Verify Instagram connection
      const account = await instagramService.getAccount();
      if (!account.connected) {
        throw new Error('Instagram account is not connected.');
      }

      // Step 7: Create official media container
      const container = await instagramService.createMediaContainer(account.id, {
        caption: `${item.caption}\n\n${item.hashtags.join(' ')}`,
        video_url: item.content_type === 'Reel' ? item.media_url || item.thumbnail_url || undefined : undefined,
        image_url: item.content_type !== 'Reel' ? item.media_url || item.thumbnail_url || undefined : undefined,
      });

      // Step 8: Wait for processing if video container
      if (item.content_type === 'Reel') {
        let attempts = 0;
        let isReady = false;
        while (attempts < 5 && !isReady) {
          const status = await instagramService.getPublishingStatus(container.id);
          if (status.status === 'FINISHED' || status.status === 'READY') {
            isReady = true;
          } else {
            attempts++;
            await new Promise((r) => setTimeout(r, 200));
          }
        }
      }

      // Step 9: Publish container
      const publishResult = await instagramService.publishMedia(account.id, container.id);

      // Step 10 & 11: Update database with Instagram Media ID and timestamp
      await repository.markContentPublished(contentId, publishResult.id);

      // Step 12: Log audit & return confirmation
      await repository.logAudit({
        action: 'PUBLISHED_SUCCESSFULLY',
        resource_type: 'content_items',
        resource_id: contentId,
        metadata: {
          instagram_media_id: publishResult.id,
          mode: instagramService.getMode(),
        },
      });

      return {
        success: true,
        instagram_media_id: publishResult.id,
        message: `Content "${item.title}" successfully published to Instagram (${instagramService.getMode()} mode).`,
      };
    } catch (error: unknown) {
      await repository.updateContentItem(contentId, { status: 'FAILED' });
      await repository.logAudit({
        action: 'PUBLISH_FAILED',
        resource_type: 'content_items',
        resource_id: contentId,
        metadata: { error: error instanceof Error ? error.message : String(error) },
      });
      throw error;
    }
  }
}
