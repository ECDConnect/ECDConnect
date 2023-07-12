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
          Subject = "[[ApplicationName]]: One-time Pin (OTP)",
          Message = "[[OTPCode]] is your [[ApplicationName]] one-time pin code.\r\nFor security reasons, please do not share your OTP Code with anyone.",
          TemplateType = TemplateTypeConstants.AuthCode,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Subject = "[[ApplicationName]]: Password changed",
          Message = "Hi [[FirstName]],\r\n\r\nWe received a request to reset your password. Go to this link to reset your password: [[PasswordResetLink:shorturl]]\r\n\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.ForgotPassword,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Subject = "Welcome to [[ApplicationName]]",
          Message = "Welcome to [[ApplicationName]] App, the SmartStart online Platform! Please tap this link to register and learn more [[InvitationLink:shorturl]]",
          TemplateType = TemplateTypeConstants.Invitation,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Subject = "[[ApplicationName]]: Three week Reminder",
          Message = "You haven\'t gone online on [[ApplicationName]] in 3 weeks!\r\nLog in and go online to keep using [[ApplicationName]]: [[LoginLink:shorturl]]",
          TemplateType = TemplateTypeConstants.ThreeWeekNotLoggedOn,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Subject = "[[ApplicationName]]: Four week Reminder",
          Message = "You haven\'t gone online on [[ApplicationName]] in 4 weeks!\r\nYou won''t be able to use the app until you go online: [[LoginLink:shorturl]]",
          TemplateType = TemplateTypeConstants.FourWeekNotLoggedOn,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Subject = "[[ApplicationName]]: Submit attendance registers and get points.",
          Message = "You have 2 days left to submit attendance registers and get [[ApplicationName]] points!\r\nIf you\'ve already submitted them, go online to see an update. [[LoginLink:shorturl]]",
          TemplateType = TemplateTypeConstants.AttendanceWeekly,
          Protocol = MessageTypeConstants.SMS
        },
        new T
        {
          Subject = "[[ApplicationName]]: You have changed your password.",
          Message = "Hi [[FirstName]],\r\n\r\nYour password on [[ApplicationName]] was changed. Please reach out to the administrator if you have any qustions.\r\n\r\nThank you!\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.PasswordChangedBySelf,
          Protocol = MessageTypeConstants.SMS
        },
        // EMAIL
        new T
        {
          Subject = "[[ApplicationName]]: One-time Pin (OTP)",
          Message = "[[OTPCode]] is your [[ApplicationName]] one-time pin code.\r\nFor security reasons, please do not share your OTP Code with anyone.",
          TemplateType = TemplateTypeConstants.AuthCode,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: Password changed",
          Message = "Hi [[FirstName]],\r\n\r\nWe received a request to reset your password. Go to this link to reset your password: [[PasswordResetLink:shorturl]]\r\n\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.ForgotPassword,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "Welcome to [[ApplicationName]]",
          Message = "Hello [[FirstName]]!\r\n\r\nYou have been added to [[ApplicationName]].\r\n\r\nPlease tap the link below to register:\r\n[[InvitationLink:shorturl]]\r\n\r\nThank you!\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.Invitation,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: Three week Reminder",
          Message = "You haven\'t gone online on [[ApplicationName]] in 3 weeks!\r\nLog in and go online to keep using [[ApplicationName]]: [[LoginLink:shorturl]]",
          TemplateType = TemplateTypeConstants.ThreeWeekNotLoggedOn,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: Four week Reminder",
          Message = "You haven\'t gone online on [[ApplicationName]] in 4 weeks!\r\nYou won''t be able to use the app until you go online: [[LoginLink:shorturl]]",
          TemplateType = TemplateTypeConstants.FourWeekNotLoggedOn,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: Submit attendance registers and get points.",
          Message = "You have 2 days left to submit attendance registers and get [[ApplicationName]] points!\r\nIf you\'ve already submitted them, go online to see an update. [[LoginLink:shorturl]]",
          TemplateType = TemplateTypeConstants.AttendanceWeekly,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: You have changed your password.",
          Message = "Hi [[FirstName]],\r\n\r\nYour password on [[ApplicationName]] was changed. Please reach out to the administrator if you have any qustions.\r\n\r\nThank you!\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.PasswordChangedBySelf,
          Protocol = MessageTypeConstants.EMAIL
        },
        
        //
        // EMAIL ONLY
        new T
        {
          Subject = "[[ApplicationName]]: Verify new email address",
          Message = "Hi [[FirstName]],\r\n\r\nPlease verify this new email address by clicking this link: [[VerifyEmailAddressLink:shorturl]]\r\n\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.VerifyEmailAddress,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: Verify new email address",
          Message = "Hi [[FirstName]],\r\nYour email address on [[ApplicationName]] was changed by [[AdminUserFullName]].\r\nPlease reach out to them if you have any qustions.\r\nThank you!\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.EmailChangedByAdmin,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: An Administrator''s email has changed.",
          Message = "Hi [[FirstName]],\r\n[[AffectedUser]]\'s email address on [[ApplicationName]] changed from [[OldUserEmail]] to [[NewUserEmail]]. It was changed by [[ChangingAdminUserName]].\r\nPlease reach out to them if you have any qustions.\r\nThank you!\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.SuperadminNotifyEmailChanged,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: You have changed your password.",
          Message = "Hi [[FirstName]],\r\n\r\nYour password on [[ApplicationName]] was changed. Please reach out to the administrator if you have any qustions.\r\n\r\nThank you!\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.PasswordChangedBySelf,
          Protocol = MessageTypeConstants.EMAIL
        },
        new T
        {
          Subject = "[[ApplicationName]]: Portal Password changed",
          Message = "Hi [[FirstName]],\r\n\r\nWe received a request to reset your password. Go to this link to reset your password: [[PasswordResetLink:shorturl]]\r\n\r\n[[OrganisationName]]",
          TemplateType = TemplateTypeConstants.ForgotPasswordPortal,
          Protocol = MessageTypeConstants.EMAIL
        },

      };
        }
    }
}
