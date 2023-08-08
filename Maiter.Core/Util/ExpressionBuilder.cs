using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Maiter.Core.Util
{
    public class ExpressionBuilder<T>
    {
        public ParameterExpression PlaceHolderParamExp
        {
            get
            {
                return Expression.Parameter(typeof(string));
            }
        }
        //   private Expression expression;
        public Expression<Func<T, bool>> EqualityExpression(object toEqual, string propertyNametoCheck)
        {
            ParameterExpression parameterPointer = Expression.Parameter(typeof(T), "d");
            MemberExpression parameterProperty = Expression.Property(parameterPointer, propertyNametoCheck);
            ConstantExpression toCheckConstant = Expression.Constant(toEqual);
            BinaryExpression equality = Expression.Equal(parameterProperty, toCheckConstant);
            return Expression.Lambda<Func<T, bool>>(equality, parameterPointer);


            //   "d=> d.Ad == 'Veli'"
        }

        public Expression<Func<T, bool>> MethodExpression(object toEqual, string propertyNametoCheck, System.Reflection.MethodInfo method)
        {
            ParameterExpression parameterPointer = Expression.Parameter(typeof(T), "d");
            MemberExpression parameterProperty = Expression.Property(parameterPointer, propertyNametoCheck);
            ConstantExpression toCheckConstant = Expression.Constant(toEqual);
            MethodCallExpression methodCall = Expression.Call(parameterProperty, method, toCheckConstant);
            return Expression.Lambda<Func<T, bool>>(methodCall, parameterPointer);
        }
    }
}
