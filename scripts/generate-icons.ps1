Add-Type -AssemblyName System.Drawing

$srcPath = "d:\GlowFit AI\public\brand\brand-mark.png"
if (-Not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$src = [System.Drawing.Image]::FromFile($srcPath)
$sizes = @(16, 32, 48, 72, 96, 128, 144, 152, 192, 256, 384, 512, 1024)

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $s, $s
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $s, $s)
    $g.Dispose()

    $dest = "d:\GlowFit AI\public\brand\icon-$s.png"
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)

    if ($s -eq 16) {
        $bmp.Save("d:\GlowFit AI\public\brand\favicon-16.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($s -eq 32) {
        $bmp.Save("d:\GlowFit AI\public\brand\favicon-32.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save("d:\GlowFit AI\public\brand\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
        $bmp.Save("d:\GlowFit AI\public\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
    }
    if ($s -eq 48) {
        $bmp.Save("d:\GlowFit AI\public\brand\favicon-48.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($s -eq 192) {
        $bmp.Save("d:\GlowFit AI\public\brand\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save("d:\GlowFit AI\public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($s -eq 512) {
        $bmp.Save("d:\GlowFit AI\public\brand\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save("d:\GlowFit AI\public\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save("d:\GlowFit AI\public\brand\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $bmp.Dispose()
}

$src.Dispose()
Write-Output "Successfully generated all multi-resolution brand icons."
