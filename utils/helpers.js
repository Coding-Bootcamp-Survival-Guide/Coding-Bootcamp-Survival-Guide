module.exports = {
    format_date: date => {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },
    format_url: url => {
      return url
        .replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .split('/')[0]
        .split('?')[0];
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
          return `${word}s`;
        }
        return word;
    },
    check_for_user_id: (array, id) => {
      let found = false
      for (i = 0; i < array.length; i++) {
        if (array[i].user_id == id) found = true;
      }
      return found;
    },
    check_for_category: (array, category_id) => {
      let found = false
      for (i = 0; i < array.length; i++) {
        if (array[i].post.category_id === category_id) found = true;
      }
      return found;
    },
    check_if_equal: (a, b) => {
      if (a === b) return true;
      else return false;
    }
  }