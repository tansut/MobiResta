using Maiter.Shared.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Data.SqlTypes;
using System.Globalization;

namespace Maiter.Shared.Util
{
    public enum DistanceMeasure
    {
        Miles,
        Kilometers,
        Meters
    }


    public static class GeographyHelper
    {

        public const double EarthRadiusInMiles = 3956.0;
        public const double EarthRadiusInKilometers = 6367.0;
        public const double EarthRadiusInMeters = 6367000.0;

        public static double ToRadian(double degrees)
        {
            return degrees * (Math.PI / 180);
        }

        public static double ToDegrees(double radians)
        {
            return radians * (180 / Math.PI);
        }

        private static double distance(double lat1, double lon1, double lat2, double lon2, DistanceMeasure unit)
        {
            double theta = lon1 - lon2;
            double dist = Math.Sin(ToRadian(lat1)) * Math.Sin(ToRadian(lat2)) + Math.Cos(ToRadian(lat1)) * Math.Cos(ToRadian(lat2)) * Math.Cos(ToRadian(theta));
            dist = Math.Acos(dist);
            dist = ToDegrees(dist);
            dist = dist * 60 * 1.1515;
            if (unit == DistanceMeasure.Kilometers)
            {
                dist = dist * 1.609344;
            }
            else if (unit == DistanceMeasure.Miles)
            {
                dist = dist * 0.8684;
            }
            else dist = dist * 1.609344 * 1000;
            return (dist);
        }

        
        
    }
}
