namespace ECDLink.Core.Extensions
{
    // Optional helper for constant-time byte comparison (prevents timing attacks)
    public static class ByteArrayExtensions
    {
        public static bool ConstantTimeEquals(this byte[] a, byte[] b)
        {
            if (a.Length != b.Length) return false;
            int diff = 0;
            for (int i = 0; i < a.Length; i++)
                diff |= a[i] ^ b[i];
            return diff == 0;
        }
    }
}
