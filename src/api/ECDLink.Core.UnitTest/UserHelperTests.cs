using ECDLink.Core.Helpers;

namespace ECDLink.Core.UnitTest
{
    public class UserHelperTests
    {
        [Theory]
        [InlineData("8801235111088")]
        [InlineData("0303255897181")]
        [InlineData("3001171234185")]
        [InlineData("4306146855181")]
        [InlineData("2703113850082")]
        [InlineData("7912138240188")]
        [InlineData("0312101097185")]
        [InlineData("1809214604186")]
        [InlineData("2209235911083")]
        public void IsSAIDValid_WithValidInput_ReturnsTrue(string idNumber)
        {
            // Act
            var result = UserHelper.IsSAIDValid(idNumber);

            // Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData("8801235111087")]
        [InlineData("0303255897101")]
        [InlineData("3001171234285")]
        [InlineData("4306146859181")]
        [InlineData("2703113840082")]
        [InlineData("7912137240188")]
        [InlineData("0312141097185")]
        [InlineData("1809014604186")]
        [InlineData("2203235911083")]
        [InlineData("2263235911083")]
        [InlineData("0063235911083")]
        [InlineData("ABCDEFGHIJKLM")]
        [InlineData("01234567890123")]
        [InlineData("012345678901")]
        [InlineData("0")]
        [InlineData("A")]
        public void IsSAIDValid_WithInvalidInput_ReturnsFalse(string idNumber)
        {
            // Act
            var result = UserHelper.IsSAIDValid(idNumber);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("a@b.com")]
        [InlineData("aaa@bbbb.cccooommm")]
        [InlineData("aaaaaaaaaaaaaaaaaaaaaaaaa@bbbbbbbbbbbbbbbbbbb.cccccccccccccccooooooommmmmmmmmmmmmm")]
        [InlineData("a@b.co.za")]
        [InlineData("a@b.za")]
        [InlineData("a1@tl.com")]
        public void IsEmailValid_WithValidEmails_ReturnTrue(string email)
        {
            // Act
            var result = UserHelper.IsEmailValid(email);

            // Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData("a@bcom")]
        [InlineData("ab.com")]
        [InlineData("abcom")]
        [InlineData("aom")]
        [InlineData("aom.")]
        public void IsEmailValid_WithInvalidEmails_ReturnFalse(string email)
        {
            // Act
            var result = UserHelper.IsEmailValid(email);

            // Assert
            Assert.False(result);
        }
    }
}