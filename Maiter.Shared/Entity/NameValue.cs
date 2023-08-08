﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.Entity
{
    public class NameValue: EntityBase
    {
        [Required]
        [StringLength(25)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Value { get; set; }
    }
}
