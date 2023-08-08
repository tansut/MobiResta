using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.Entity
{
    public interface IAttachable: IEntity
    {
        List<EntityAttachment> Attachments { get; set; }
    }

    public interface ITaggable: IEntity
    {
        List<EntityTag> Tags { get; set; }
    }
}
