using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Providers.Barcode
{
    public interface IBarcodeGenerator
    {
        Bitmap Generate(object text);
        Bitmap Generate(object text, int width);
        Bitmap Generate(object text, int width, int height);
    }
}
