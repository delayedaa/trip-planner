let expect = require('chai').expect;
let request = require('supertest');
let app = require('../server');
let db = require('../models');
let agent = request.agent(app);

before(done => {
  db.sequelize.sync({ force: true }).then(() => {
    done();
  });
});

describe('Create Trip', () => {
  it('should create successfully', done => {
    db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe20@gmail.com',
      password: 'password'
    }).then(user => {
      user.createTrip({
        name: 'First Trip',
        startDate: '2021-01-01',
        endDate: '2021-01-07'
      }).then(() => {
        done();
      }).catch(err => {
        done(err);
      });
    });
  });

  it('should throw error on invalid name', done => {
    db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe21@gmail.com',
      password: 'password'
    }).then(user => {
      user.createTrip({
        name: '',
        startDate: '2021-01-01',
        endDate: '2021-01-07'
      }).then(newTrip => {
        done(newTrip);
      }).catch(err => {
        done();
      });
    });
  });

  it('should throw error on invalid start date', done => {
    db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe22@gmail.com',
      password: 'password'
    }).then(user => {
      user.createTrip({
        name: 'My Trip',
        startDate: 'start date',
        endDate: '2021-01-07'
      }).then(newTrip => {
        done(newTrip);
      }).catch(err => {
        done();
      });
    });
  });

  it('should throw error on invalid end date', done => {
    db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe23@gmail.com',
      password: 'password'
    }).then(user => {
      user.createTrip({
        name: 'My Trip',
        startDate: '2021-01-01',
        endDate: 'end date'
      }).then(newTrip => {
        done(newTrip);
      }).catch(err => {
        done();
      });
    });
  });
});

describe('Trips Controller', () => {
  describe('GET /trips', () => {
    it('should redirect to /auth/login if not logged in', done => {
      request(app).get('/trips')
        .expect('Location', '/auth/login')
        .expect(302, done);
    });

    it('should return 200 response if logged in', done => {
      agent.post('/auth/signup')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'jdoe24@gmail.com',
          password: 'password'
        })
        .expect(302)
        .expect('Location', '/')
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            agent.get('/trips').expect(200, done);
          }
        });
    });
  });

  // describe('POST /trips', () => {
  //   it('should redirect to /trips on success', done => {

  //   })
  // })
});