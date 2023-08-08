using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Maiter.Shared.Util
{
    public class MinMax
    {
        public int Min { get; set; }
        public int Max { get; set; }
    }

    public class TableExpressionParseResult
    {
        public bool All { get; set; }
        public List<string> GroupNames { get; set; }
        public List<int> NumberList { get; set; }
        public List<MinMax> Range { get; set; }

        public TableExpressionParseResult()
        {
            this.NumberList = new List<int>();
            this.GroupNames = new List<string>();
            this.Range = new List<MinMax>();
        }
    }

    public static class TableSelectionParser
    {
        public static TableExpressionParseResult Parse(string expression)
        {
            var result = new TableExpressionParseResult();
            if (expression.Trim() == "*")
            {
                result.All = true;
            }
            else
            {
                var parts = expression.Split(',');
                foreach (var item in parts)
                {
                    var groupMatch = Regex.Match(item, @"\[(.*?)\]");
                    if (groupMatch.Length > 0)
                        result.GroupNames.Add(groupMatch.Groups[1].Value);
                    var interval = Regex.Matches(item, "([0-9]*)-([0-9]*)");
                    if (interval.Count == 1)
                    {
                        result.Range.Add(new MinMax()
                        {
                            Min = int.Parse(interval[0].Groups[1].Value),
                            Max = int.Parse(interval[0].Groups[2].Value)
                        });
                    }
                    else
                    {
                        var numberMatch = Regex.Match(item, @"[0-9]*");
                        if (numberMatch.Length > 0)
                            result.NumberList.Add(int.Parse(numberMatch.Value));
                    }
                }
            }

            return result;
        }
    }
}
