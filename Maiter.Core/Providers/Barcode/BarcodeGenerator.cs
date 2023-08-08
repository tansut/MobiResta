using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZXing;
using ZXing.Common;
using ZXing.QrCode;
namespace Maiter.Core.Providers.Barcode
{
    public class BarcodeGenerator : IBarcodeGenerator
    {
        private QRCodeWriter writer;
        public BarcodeGenerator()
        {
            writer = new QRCodeWriter();
        }

        public Bitmap Generate(object text)
        {
            return this.Generate(text, 100);
        }
        public Bitmap Generate(object text, int width)
        {
            return this.Generate(text, width, width);
        }
        public Bitmap Generate(object text, int width, int height)
        {
            var barcodeValue = "";
            if (text is string)
                barcodeValue = (string)text;
            else barcodeValue = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(Newtonsoft.Json.JsonConvert.SerializeObject(text)));
            BitMatrix matrix = this.writer.encode(barcodeValue, BarcodeFormat.QR_CODE, width, height);
            BarcodeWriter bw = new BarcodeWriter();
            return bw.Write(matrix);
        }
    }
}
