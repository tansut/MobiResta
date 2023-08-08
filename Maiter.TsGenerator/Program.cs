using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TypeLite;
using TypeLite.TsModels;

namespace Maiter.TsGenerator
{
    class Program
    {
        static Assembly LoadAssembly(string path)
        {
            return Assembly.LoadFile(path);
        }


        static TypeScriptFluent GetFluent(Assembly module)
        {
            TsTypeVisibilityFormatter f = new TsTypeVisibilityFormatter((c, name) =>
            {
                return true;
            });

            var ts = TypeScript.Definitions().For(module);

            ts.ScriptGenerator.SetTypeVisibilityFormatter(f);
            

            //ts.WithMemberFormatter((identifier) =>
            //{
            //    return Char.ToLower(identifier.Name[0]) + identifier.Name.Substring(1);
            //    }
            //   );

            return ts;
        }


        static string generate(Assembly module)
        {
            return GetFluent(module).Generate();
        }

        static string generate(Assembly module, TsGeneratorOutput output)
        {
            return GetFluent(module).Generate(output);
        }

        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("2 args");
                Environment.Exit(12);
            }
            else
            {
                var source = args[0];
                var dest = args[1];

                var module = LoadAssembly(source);
                if (module == null)
                {
                    Console.WriteLine("Error loading assembly");
                    Environment.Exit(22);
                }
                else
                {
                    var headers = "import {Kalitte} from '../Kalitte/Data/Models';"; 
                    var contentAll = generate(module);
                    var contentConstants = generate(module, TsGeneratorOutput.Constants);
                    var processedAll = processContent(contentAll, module.GetName().Name);
                    var processedConst = processContent(contentConstants, module.GetName().Name);
                    File.WriteAllText(dest, headers + Environment.NewLine + processedConst + Environment.NewLine + processedAll);
                }
            }
        }

        private static string processContent(string content, string assemblyName = "")
        {
            var lines = content.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            var sb = new StringBuilder();
            for (int i = 0; i < lines.Length; i++)
            {
                var isDeclare = lines[i].IndexOf("declare module") >= 0;
                if (isDeclare)
                {
                    lines[i] = lines[i].Replace("declare module", "export module");
                }

                var isModule = lines[i].StartsWith("module");
                if (isModule)
                {
                    lines[i] = lines[i].Replace("module", "export module");
                }
                var isEnum = lines[i].TrimStart().StartsWith("enum");
                if (isEnum)
                {
                    lines[i] = lines[i].Replace("enum", "export enum");
                }


                if (assemblyName != "")
                {
                    var containsName = lines[i].IndexOf(assemblyName) >= 0;
                    if (containsName)
                        lines[i] = lines[i].Replace(assemblyName + ".", "");
                }

                lines[i] = lines[i].Replace("Entity.EntityBase", "CoreEntityBase");
                lines[i] = lines[i].Replace("export module Kalitte", "module Foo");

                lines[i] = Regex.Replace(lines[i], @":\s*System\.Collections\.Generic\.KeyValuePair\<(?<k>[^\,]+),(?<v>[^\,]+)\>\[\];", m => ": {[key: " + m.Groups["k"].Value + "]: " + m.Groups["v"].Value + "};", RegexOptions.Multiline);

                sb.AppendLine(lines[i]);
            }



            return sb.ToString();
        }
    }
}
