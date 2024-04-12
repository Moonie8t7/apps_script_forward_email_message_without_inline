/**
 * @author u/IAmMoonie <https://www.reddit.com/user/IAmMoonie/>
 * @file https://www.reddit.com/r/GoogleAppsScript/comments/1c2abwr/apps_script_forward_email_message_without_inline/
 * @desc Forward emails without inline images
 * @license MIT
 * @version 1.0
 */

/**
 * Configuration object for label name and forwarding address.
 * @typedef {Object} Config
 * @property {string} labelName - The name of the Gmail label.
 * @property {string} forwardingAddress - The email address to forward messages to.
 */

/** @type {Config} */
const CONFIG = {
  labelName: "Your Label Name",
  forwardingAddress: "example@example.com"
};

/**
 * Forwards email messages with PDF attachments from a specified Gmail label to a specified email address.
 * @returns {void}
 */
function forwardPDFAttachments() {
  try {
    const label = GmailApp.getUserLabelByName(CONFIG.labelName);
    if (!label) {
      console.warn(`Label "${CONFIG.labelName}" not found.`);
      return;
    }
    
    const threads = label.getThreads();
    threads.forEach((thread) => {
      thread.getMessages().forEach((message) => {
        message.getAttachments({ includeInlineImages: false }).forEach((attachment) => {
          if (attachment.getContentType() === "application/pdf") {
            message.forward(CONFIG.forwardingAddress, {
              from: message.getFrom(),
              subject: message.getSubject(),
              htmlBody: "Message sent to external app"
            });
            console.info(`Forwarded message with PDF attachment from: ${message.getFrom()}, subject: ${message.getSubject()}`);
          }
        });
      });
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
