using System;
using Dapper.Contrib.Extensions;

namespace PTL.Models
{
    public class PutToLight
    {
        public string Zone { get; set; }
        public string Name { get; set; }
        public string PartName { get; set; }
        public string Code { get; set; }
        public int Qty { get; set; }
    }
}
