describe('Bloglist App', function() {
    beforeEach(function() {
        cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
        const user = {
            name: 'Test',
            username: 'test',
            password: '1234'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
        cy.visit('')
    })

    it('front page can be opened', function() {
        cy.contains('Log in to application')
    })

    it('user can login', function () {
        cy.get('#username').type('test')
        cy.get('#password').type('1234')

        cy.get('#login-button').click()

        cy.contains('Test logged in')
    })

    it('login fails with wrong password', function() {
        cy.get('#username').type('test')
        cy.get('#password').type('4321')

        cy.get('#login-button').click()

        cy.get('.error')
            .should('contain', 'invalid username or password')
            .and('have.css', 'color', 'rgb(255, 0, 0)')

        cy.get('html').should('not.contain', 'Test logged in')
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'test', password: '1234' })
        })

        it('a new blog can be created', function() {
            cy.createBlog({ title: 'a blog created by cypress', author: 'cypress', url: 'http://cypress.sample.blog' })

            cy.contains('a blog created by cypress')
        })

        it('a blog can be liked', function() {
            cy.createBlog({ title: 'a blog created by cypress', author: 'cypress', url: 'http://cypress.sample.blog' })

            cy.contains(/^a blog created by cypress/).contains('view').click()
            cy.contains(/^a blog created by cypress/).contains('like').click()

            cy.contains('likes 1')
        })

        it('a blog can be deleted by the creator', function() {
            cy.createBlog({ title: 'a blog created by cypress', author: 'cypress', url: 'http://cypress.sample.blog' })

            cy.contains(/^a blog created by cypress/).contains('view').click()

            cy.contains('remove').click()
            cy.get('.success')
                .should('contain', 'was removed')
                .and('have.css', 'color', 'rgb(0, 128, 0)')
        })

        it('a blog can not be deleted by another user', function() {
            cy.createBlog({ title: 'a blog created by cypress', author: 'cypress', url: 'http://cypress.sample.blog' })

            const user = {
                name: 'Test 2',
                username: 'test2',
                password: '1234'
            }
            cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
            cy.login({ username: 'test2', password: '1234' })

            cy.contains(/^a blog created by cypress/).contains('view').click()
            cy.contains(/^a blog created by cypress/).should('not.contain', 'remove')
        })

        it('blogs are ordered by number of likes', function(){
            cy.createBlog({
                title: 'a blog with some likes',
                author: 'cypress',
                url: 'http://cypress.sample.blog' })
            cy.contains(/^a blog with some likes/)

            cy.createBlog({
                title: 'a blog with least likes',
                author: 'cypress',
                url: 'http://cypress.sample.blog' })
            cy.contains(/^a blog with least likes/)

            cy.createBlog({
                title: 'another blog with some likes',
                author: 'cypress',
                url: 'http://cypress.sample.blog' })
            cy.contains(/^another blog with some likes/)

            cy.createBlog({
                title: 'a blog with most likes',
                author: 'cypress',
                url: 'http://cypress.sample.blog' })
            cy.contains(/^a blog with most likes/)

            cy.contains(/^a blog with some likes/).contains('view').click()
            cy.contains(/^a blog with some likes/).contains('like').click()
            cy.contains(/^a blog with some likes/).contains('likes 1')

            cy.contains(/^another blog with some likes/).contains('view').click()
            cy.contains(/^another blog with some likes/).contains('like').click()
            cy.contains(/^another blog with some likes/).contains('likes 1')

            cy.contains(/^a blog with most likes/).contains('view').click()
            cy.contains(/^a blog with most likes/).contains('like').click()
            cy.contains(/^a blog with most likes/).contains('likes 1')
            cy.contains(/^a blog with most likes/).contains('like').click()
            cy.contains(/^a blog with most likes/).contains('likes 2')

            cy.get('.blogListItem').eq(0).should('contain', 'a blog with most likes')
            cy.get('.blogListItem').eq(3).should('contain', 'a blog with least likes')
        })
    })
})