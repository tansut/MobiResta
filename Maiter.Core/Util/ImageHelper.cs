using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Util
{
    public static class ImageHelper
    {
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }

        public static Image GetResized(Image image, Size newSize, bool shrinkOnly = false)
        {
            if (newSize.IsEmpty)
                return image;

            int targetWidth = newSize.Width == 0 ? image.Width : newSize.Width;
            int targetHeight = newSize.Height == 0 ? image.Height : newSize.Height;

            if (targetHeight == image.Height && targetWidth == image.Width)
                return image;

            if (targetWidth > image.Width && shrinkOnly)
                targetWidth = image.Width;

            if (targetWidth == image.Width)
                targetWidth = Convert.ToInt32(image.Width * (Convert.ToDouble(targetHeight) / image.Height));

            if (targetHeight == image.Height)
                targetHeight = Convert.ToInt32(image.Height * (Convert.ToDouble(targetWidth) / image.Width));


            var resizedImage = ResizeImage(image, Convert.ToInt32(targetWidth), Convert.ToInt32(targetHeight));

            return resizedImage;
        }

        public static Stream GetResized(Stream memoryStream, Size newSize, bool shrinkOnly = false)
        {
            if (newSize.IsEmpty)
                return memoryStream;

            using (var ms = memoryStream)
            {
                var image = Image.FromStream(ms);

                var resizedImage = GetResized(image, newSize, shrinkOnly);

                var output = new MemoryStream();
                resizedImage.Save(output, image.RawFormat);// ImageFormat.Jpeg);
                ms.Close();
                return output;
            }

        }

        internal static Stream GetResized(Stream memoryStream, NameValueCollection render)
        {
            if (!render.HasKeys())
                return memoryStream;

            var size = new Size(string.IsNullOrEmpty(render["width"]) ? 0 : int.Parse(render["width"]),
                string.IsNullOrEmpty(render["height"]) ? 0 : int.Parse(render["height"]));

            return GetResized(memoryStream, size);
        }
    }
}
