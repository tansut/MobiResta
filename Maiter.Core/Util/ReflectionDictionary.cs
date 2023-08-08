using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Util
{
    public class ReflectionDictionary<T> where T : Attribute
    {
        Dictionary<Type, List<PropertyInfo>> _properties = new Dictionary<Type, List<PropertyInfo>>();

        public ReflectionDictionary()
        {

        }

        public List<PropertyInfo> Get(Type entityType)
        {
            List<PropertyInfo> s;
            if (_properties.TryGetValue(entityType, out s))
                return s;
            else
            {
                var attributeProperties = GetAttributesOfEntity(entityType);
                _properties.Add(entityType, attributeProperties);
                return attributeProperties;
            }
        }

        public bool Has(Type entityType, string propertyName)
        {
            var list = this.Get(entityType);
            return list.Any(d => d.Name == propertyName);
        }

        private List<PropertyInfo> GetAttributesOfEntity(Type entityType)
        {
            List<PropertyInfo> _attributedProperties = new List<PropertyInfo>();

            entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance).ToList().ForEach((d) =>
              {
                  var att = d.GetCustomAttribute<T>(true);
                  if (att != null)
                  {
                      _attributedProperties.Add(d);
                  }
              });

            return _attributedProperties;
        }
    }



}
