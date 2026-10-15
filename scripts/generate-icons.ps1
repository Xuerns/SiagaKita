Add-Type -AssemblyName System.Drawing

function Generate-PwaIcon {
    param(
        [int]$size, 
        [string]$outputPath, 
        [bool]$maskable = $false
    )
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background Gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $c1 = [System.Drawing.ColorTranslator]::FromHtml('#0F3822')
    $c2 = [System.Drawing.ColorTranslator]::FromHtml('#176B4D')
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45.0)
    
    if ($maskable) {
        $g.FillRectangle($brush, $rect)
    } else {
        $radius = [int]($size * 0.22)
        $pathObj = New-Object System.Drawing.Drawing2D.GraphicsPath
        $pathObj.AddArc(0, 0, $radius * 2, $radius * 2, 180, 90)
        $pathObj.AddArc($size - $radius * 2, 0, $radius * 2, $radius * 2, 270, 90)
        $pathObj.AddArc($size - $radius * 2, $size - $radius * 2, $radius * 2, $radius * 2, 0, 90)
        $pathObj.AddArc(0, $size - $radius * 2, $radius * 2, $radius * 2, 90, 90)
        $pathObj.CloseFigure()
        $g.FillPath($brush, $pathObj)
    }
    
    # Scale & Offset
    $scale = $size / 512.0
    if ($maskable) { $scale = $scale * 0.78 }
    $offsetX = ($size - (512.0 * $scale)) / 2.0
    $offsetY = ($size - (512.0 * $scale)) / 2.0
    
    # Shield Body
    $shield = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p1 = New-Object System.Drawing.PointF([float]($offsetX + 128 * $scale), [float]($offsetY + 120 * $scale))
    $p2 = New-Object System.Drawing.PointF([float]($offsetX + 256 * $scale), [float]($offsetY + 96 * $scale))
    $p3 = New-Object System.Drawing.PointF([float]($offsetX + 384 * $scale), [float]($offsetY + 120 * $scale))
    $p4 = New-Object System.Drawing.PointF([float]($offsetX + 256 * $scale), [float]($offsetY + 424 * $scale))
    
    $shield.AddCurve(@($p1, $p2, $p3))
    $shield.AddBezier($p3, 
        (New-Object System.Drawing.PointF([float]($offsetX + 384 * $scale), [float]($offsetY + 340 * $scale))),
        (New-Object System.Drawing.PointF([float]($offsetX + 320 * $scale), [float]($offsetY + 400 * $scale))),
        $p4)
    $shield.AddBezier($p4, 
        (New-Object System.Drawing.PointF([float]($offsetX + 192 * $scale), [float]($offsetY + 400 * $scale))),
        (New-Object System.Drawing.PointF([float]($offsetX + 128 * $scale), [float]($offsetY + 340 * $scale))),
        $p1)
    $shield.CloseFigure()
    
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillPath($whiteBrush, $shield)
    
    # Checkmark inside shield
    $greenPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#176B4D'), [float](36 * $scale))
    $greenPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $greenPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $greenPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    
    $chkPt1 = New-Object System.Drawing.PointF([float]($offsetX + 175 * $scale), [float]($offsetY + 245 * $scale))
    $chkPt2 = New-Object System.Drawing.PointF([float]($offsetX + 225 * $scale), [float]($offsetY + 295 * $scale))
    $chkPt3 = New-Object System.Drawing.PointF([float]($offsetX + 335 * $scale), [float]($offsetY + 185 * $scale))
    
    $g.DrawLines($greenPen, @($chkPt1, $chkPt2, $chkPt3))
    
    # Early Warning Pulse Dot
    $pulseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#34D399'))
    $pulseRadius = [float](14 * $scale)
    $g.FillEllipse($pulseBrush, [float]($offsetX + 360 * $scale - $pulseRadius), [float]($offsetY + 144 * $scale - $pulseRadius), [float]($pulseRadius * 2), [float]($pulseRadius * 2))

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Success: Generated $outputPath ($size x $size)"
}

Generate-PwaIcon -size 192 -outputPath "F:\SiagaKita\public\icon-192x192.png" -maskable $false
Generate-PwaIcon -size 512 -outputPath "F:\SiagaKita\public\icon-512x512.png" -maskable $false
Generate-PwaIcon -size 512 -outputPath "F:\SiagaKita\public\icon-maskable-512.png" -maskable $true
Generate-PwaIcon -size 180 -outputPath "F:\SiagaKita\public\apple-touch-icon.png" -maskable $false
