using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Notifications
{
    internal static class SeedMessageTemplates<T>
    where T : MessageTemplate, new()
    {
        internal static IList<T> GetMessageTemplates()
        {
            return new List<T>()
      {
        // SMS
        new T
        {
          Message = "[[code]] is your Funda App code",
          TemplateType = TemplateTypeConstants.AuthCode,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Message = "Hi [[firstname]], we received a request to reset your password. Go to this link to reset your password: [[callback:shorturl]]",
          TemplateType = TemplateTypeConstants.ForgotPassword,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Message = "Welcome to Funda App, The SmartStart online platform! Please tap this link to register and learn more: [[callback:shorturl]]",
          TemplateType = TemplateTypeConstants.Invitation,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Message = "You haven't gone online on Funda App in 3 weeks! Log in and go online to keep using Funda: [[callback]]",
          TemplateType = TemplateTypeConstants.ThreeWeekNotLoggedOn,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Message = "You haven't gone online on Funda App in 4 weeks! You won't be able to use the app until you go online: [[callback]]",
          TemplateType = TemplateTypeConstants.FourWeekNotLoggedOn,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Message = "You have 2 days left to submit attendance registers and get SmartStart points! If you've already submitted them, go online to see an update. [[callback]]",
          TemplateType = TemplateTypeConstants.TrackAttendanceWeekly,
          Protocol = MessageTypeConstants.SMS
        },
        // EMAIL
        new T
        {
          Message = "[[callback]]",
          TemplateType = TemplateTypeConstants.AuthCode,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Message = "[[callback]]",
          TemplateType = TemplateTypeConstants.ForgotPassword,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Message = "[[callback]]",
          TemplateType = TemplateTypeConstants.Invitation,
          Protocol = MessageTypeConstants.EMAIL
        },
      };
        }
    }
}
