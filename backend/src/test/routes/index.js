describe.only('Routes: index', () => {
  describe('GET /', () => {
    it('Returns the API status', (done) => {
      request
        .get('/')
        .expect(200)
        .end((err, res) => {
          const expected = {
            status: 'Touch API'
          }

          expect(res.body).to.eql(expected)

          done(err)
        })
    })
  })
})
