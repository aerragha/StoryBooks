const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let newStr = str + ''
      newStr = str.substr(0, len)
      newStr = str.substr(0, newStr.lastIndexOf(' '))
      newStr = newStr.length > 0 ? newStr : str.substr(0, len)
      return newStr + '...'
    }
    return str
  },
  scriptTags: function (body) {
    return body.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  select: function (option) {
    const options = ['public', 'private']
    let ch = ''
    options.forEach((opt) => {
      console.log(opt, option)
      if (opt === option)
        ch += `<option value="${opt}" class="uprcase" selected>${
          opt.charAt(0).toUpperCase() + opt.slice(1)
        }</option>`
      else
        ch += `<option value="${opt}" class="uprcase">${
          opt.charAt(0).toUpperCase() + opt.slice(1)
        }</option>`
    })
    return ch
  },
}
