const assert = require('assert')
const addLinkTitle = require('../../src/services/blog/hook.add-link-title')

describe('\'blogLinkTitle\' hook', () => {
  it('should remove non numbers or letters, replace spaces with dashes, and make everything lower cases', () => {
    // A mock hook object
    const mock = {
      data: {
        title: ' Hello How Are  You number 4 '
      }
    }
    const hook = addLinkTitle()

    return hook(mock).then(result => {
      assert.equal(result.data.linkTitle, 'hello-how-are-you-number-4')
    })
  })
})
