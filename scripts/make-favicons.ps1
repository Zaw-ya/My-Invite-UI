Add-Type -AssemblyName System.Drawing

$srcPath = "d:\ui myinvite\My-Invite-UI\public\image\logo.png"
$destDir = "d:\ui myinvite\My-Invite-UI\public"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source logo file not found at $srcPath"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Output "Loaded logo image: $($img.Width)x$($img.Height)"

# Crop/pad to a perfect square to ensure optimal favicon presentation
$size = [Math]::Min($img.Width, $img.Height)
$cropX = [Math]::Max(0, [Math]::Floor(($img.Width - $size) / 2))
$cropY = [Math]::Max(0, [Math]::Floor(($img.Height - $size) / 2))

$sizes = @(16, 32, 48, 96, 180, 192)

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $s, $s
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    
    # High-quality rendering properties
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Draw the cropped square logo onto the new canvas size
    $graph.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $s, $s), $cropX, $cropY, $size, $size, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Map to proper naming scheme
    $outPath = ""
    if ($s -eq 180) {
        $outPath = Join-Path $destDir "apple-touch-icon.png"
    } else {
        $outPath = Join-Path $destDir "favicon-$($s)x$($s).png"
    }
    
    # Overwrite if exists
    if (Test-Path $outPath) { Remove-Item $outPath -Force }
    
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Saved: $outPath"
    
    $graph.Dispose()
    $bmp.Dispose()
}

# Create native multi-resolution favicon.ico containing 48x48 (Google's preferred size)
$bmp48 = New-Object System.Drawing.Bitmap 48, 48
$graph48 = [System.Drawing.Graphics]::FromImage($bmp48)
$graph48.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph48.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graph48.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 48, 48), $cropX, $cropY, $size, $size, [System.Drawing.GraphicsUnit]::Pixel)

$icoPath = Join-Path $destDir "favicon.ico"
if (Test-Path $icoPath) { Remove-Item $icoPath -Force }

$icon = [System.Drawing.Icon]::FromHandle($bmp48.GetHicon())
$fs = [System.IO.File]::Create($icoPath)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()

$bmp48.Dispose()
$graph48.Dispose()
$img.Dispose()

Write-Output "Favicons successfully generated!"
