using Maiter.Shared.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Data
{
    [TsClass]
    public class GeoPoint
    {
        [Updatable]
        public double Lat { get; set; }

        [Updatable]
        public double Long { get; set; }

        public GeoPoint()
        {
            this.Lat = 0.0;
            this.Long = 0.0;
        }

        [TsIgnore]
        [JsonIgnore]
        public bool IsEmpty
        {
            get
            {
                return Lat == 0.0 && Long == 0.0;
            }
        }

        public GeoPoint(double lat, double Long)
        {
            this.Lat = lat;
            this.Long = Long;
        }
    }
}
