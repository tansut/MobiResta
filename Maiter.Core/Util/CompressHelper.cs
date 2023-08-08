using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Util
{
    public static class CompressHelper
    {
        public static byte [] Compress(byte [] source)
        {
            using (var ms = new MemoryStream())
            {
                using (DeflateStream compressionStream = new DeflateStream(ms, CompressionMode.Compress))
                {
                    var target = new byte[source.Length];
                    compressionStream.Write(source, 0, source.Length);
                }

                return ms.ToArray();

            }
        }

        public static byte [] Decompressed(byte[] data)
        {
            var output = new MemoryStream();
            using (var compressedStream = new MemoryStream(data))
            using (var zipStream = new DeflateStream(compressedStream, CompressionMode.Decompress))
            {
                zipStream.CopyTo(output);
                zipStream.Close();
                return output.ToArray();
            }
        }

        public static MemoryStream Decompress(byte[] data)
        {
            var output = new MemoryStream();
            using (var compressedStream = new MemoryStream(data))
            using (var zipStream = new DeflateStream(compressedStream, CompressionMode.Decompress))
            {
                zipStream.CopyTo(output);
                zipStream.Close();
                return output;
            }
        }
    }
}
