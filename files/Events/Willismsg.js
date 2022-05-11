module.exports = {
  name: 'Willismsg',
  async execute(msg) {
    if (msg.guild) {
      if (msg.channel.id == '805839305377447936') {
        if (!msg.attachments.size > 0) {
          if (
            !msg.guild.member(msg.author).roles.cache.has('293928278845030410') &&
            !msg.guild.member(msg.author).roles.cache.has('278332463141355520')
          ) {
            msg.delete();
          }
        }
      }
    }
  },
};
