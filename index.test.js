import micro from 'micro'
import listen from 'test-listen'
import test from 'ava'
import request from 'request-promise'
import blogium, {privates} from './'

test('filter comments out of feed', t => {
  const mockArray = [
    {name: 'foo', categories: []},
    {name: 'foo', categories: [4, 5, 6, 3]},
    {name: 'foo', categories: []},
    {name: 'foo', categories: [1, 2, 3]}
  ]

  t.is(privates._onlyPosts(mockArray).length, 2, 'filtered only posts with categories')
})

test('check sanitizePostList', t => {
  const mockArray = [{
    title: 'mock title',
    date: '2022-01-01 17:14:14',
    link: 'https://medium.com/@foo',
    guid: 'https://medium.com/p/foohash',
    author: 'Foobar da Silva',
    thumbnail: '',
    description: 'mock description',
    content: 'foo content',
    enclosure: [],
    categories: []
  }]

  const expectedArray = [{
    title: 'mock title',
    date: '2022-01-01 17:14:14',
    link: 'https://medium.com/@foo',
    categories: []
  }]

  const result = privates._sanitizePostList(mockArray)

  t.true(JSON.stringify(result) === JSON.stringify(expectedArray), 'json is properly sanitized')
})

test('test root request', async t => {
  const service = micro(blogium)
  const url = await listen(service)
  const body = await request(`${url}/atilafassina`)

  t.is(Array.isArray(JSON.parse(body)), true)
  service.close()
})
