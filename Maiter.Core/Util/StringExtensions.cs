using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Extensions
{
    public static class StringExtensions
    {

        public static bool IsNumeric(this string input)
        {
            double number;
            return double.TryParse(input, out number);
        }

        public static bool IsDate(this string input)
        {
            DateTime date;
            return DateTime.TryParse(input, out date);
        }

        public static string Capitalize(this string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;
            string[] words = input.Split(' ');

            StringBuilder sb = new StringBuilder();

            foreach (var word in words)
            {
                string firstChar = word.Substring(0, 1).ToUpper();
                string rest = word.Substring(1);
                sb.Append(string.Concat(firstChar, rest));
            }

            return sb.ToString();
        }
    }
}
