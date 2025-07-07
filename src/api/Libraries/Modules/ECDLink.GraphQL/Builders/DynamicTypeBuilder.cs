namespace ECDLink.EGraphQL.Builders
{
    public class DynamicTypeBuilder
    {
        private string _type;

        public DynamicTypeBuilder(string type)
        {
            _type = type;
        }

        public DynamicTypeBuilder Enumerable()
        {
            if (!_type.Contains('['))
            {
                _type = $"[{_type}]";
            }

            return this;
        }

        public DynamicTypeBuilder Required()
        {
            if (!_type.EndsWith("!"))
            {
                _type = $"{_type}!";
            }

            return this;
        }

        public DynamicTypeBuilder Input()
        {
            if (!_type.EndsWith("Input"))
            {
                _type = $"{_type}Input";
            }

            return this;
        }

        public string Build()
        {
            return _type;
        }
    }
}
