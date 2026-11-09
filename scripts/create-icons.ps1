Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$assetRoot = Join-Path $projectRoot 'assets/brand'
$original = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'favicon.png'))
try {
  foreach ($size in @(16,32,48,180,192,512)) {
    $bitmap = [System.Drawing.Bitmap]::new($size,$size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $inset = [int][Math]::Round($size * 0.14)
      $graphics.DrawImage($original,$inset,$inset,($size-2*$inset),($size-2*$inset))
      $bitmap.Save((Join-Path $assetRoot "icon-$size.png"),[System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
  }
  # ICO directory containing the three native-resolution PNG frames.
  $frames = @(16,32,48) | ForEach-Object { ,([IO.File]::ReadAllBytes((Join-Path $assetRoot "icon-$_.png"))) }
  $stream = [IO.File]::Create((Join-Path $assetRoot 'favicon.ico'))
  $writer = [IO.BinaryWriter]::new($stream)
  try {
    $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]3)
    $offset = 6 + 16 * 3
    for ($index=0; $index -lt 3; $index++) {
      $size = @(16,32,48)[$index]
      $writer.Write([byte]$size); $writer.Write([byte]$size)
      $writer.Write([byte]0); $writer.Write([byte]0)
      $writer.Write([uint16]1); $writer.Write([uint16]32)
      $writer.Write([uint32]$frames[$index].Length); $writer.Write([uint32]$offset)
      $offset += $frames[$index].Length
    }
    foreach ($frame in $frames) { $writer.Write([byte[]]$frame) }
  } finally { $writer.Dispose(); $stream.Dispose() }
} finally { $original.Dispose() }
Write-Output 'Created favicon.ico and PNG icons (16, 32, 48, 180, 192, 512). Original preserved.'
