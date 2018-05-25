/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */
/* global expect, sinon */
'use strict';

var Playground = require('../Playground');

describe('A playground', function () {
  var playground;

  beforeEach(function () {
    playground = new Playground('here');
  });

  it(", when it's new, has no codeObject", function () {
    expect(playground.population()).to.deep.equal([]);
  });

  it("can list its codeObject's ids", function () {
    playground.getOrCreateCodeObject('bob');
    playground.getOrCreateCodeObject('jack');
    playground.getOrCreateCodeObject('0');
    expect(playground.population()).to.deep.equal(['bob', 'jack', '0']);
  });

  it('can tell if it is empty', function () {
    expect(playground.isEmpty()).to.be.true;
  });

  it('can tell if it is not empty', function () {
    playground.getOrCreateCodeObject('bob');
    expect(playground.isEmpty()).to.be.false;
  });

  it('can tell when it does not contain a codeObject, based on its id', function () {
    expect(playground.contains('bob')).to.be.false;
  });

  it('can tell when it contains a codeObject, based on its id', function () {
    playground.getOrCreateCodeObject('bob');
    expect(playground.contains('bob')).to.be.true;
  });

  it('has a id', function () {
    expect(playground.id).to.equal('here');
  });

  it('has only one code object per id', function () {
    var bob = playground.getOrCreateCodeObject('bob');
    var theOtherBob = playground.getOrCreateCodeObject('bob');
    expect(theOtherBob).to.equal(bob);
  });

  it('can delete a codeObject', function () {
    playground.getOrCreateCodeObject('bob');
    playground.deleteCodeObject('bob');

    expect(playground.population()).to.deep.equal([]);
    expect(playground.contains('bob')).to.be.false;
  });

  it("'s data contains its code objects", function () {
    var bob = playground.getOrCreateCodeObject('bob');
    bob.setData({code: 'hello()'});
    expect(playground.getData()).to.deep.equal([
      {
        codeObjectId: 'bob',
        code: 'hello()'
      }
    ]);
  });

  it('can return data for an existing code object', function () {
    var bob = playground.getOrCreateCodeObject('bob');
    bob.setData({code: 'hello()'});
    expect(playground.getDataFor('bob')).to.deep.equal({
      codeObjectId: 'bob',
      code: 'hello()'
    });
  });

  it('can create temporary data for a non-existing code object', function () {
    expect(playground.getDataFor('alice')).to.deep.equal({
      codeObjectId: 'alice',
      code: ''
    });
    expect(playground.contains('alice')).to.be.false;
  });

  it('can rename a code object without changing its place in the list', function () {
    playground.getOrCreateCodeObject('bob');
    playground.getOrCreateCodeObject('jack');
    playground.getOrCreateCodeObject('lucie');

    playground.renameCodeObject('jack', 'jo');
    expect(playground.population()).to.deep.equal(['bob', 'jo', 'lucie']);
    expect(playground.getOrCreateCodeObject('jo').id).to.equal('jo');
  });
});

describe('Playground notifies', function () {
  it("when a codeObject's code is set", function () {
    var spy = sinon.spy();
    var playground = new Playground('any');
    var codeObject = playground.getOrCreateCodeObject('ugly');
    playground.on('codeObjectUpdated', spy);

    codeObject.setData({code: '// hello'});

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it('when a codeObject is deleted', function () {
    var spy = sinon.spy();
    var playground = new Playground('any');
    var codeObject = playground.getOrCreateCodeObject('ugly');
    playground.on('codeObjectDeleted', spy);

    playground.deleteCodeObject('ugly');

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it('not on attempt to delete an unkwown codeObject', function () {
    var spy = sinon.spy();
    var playground = new Playground('any');
    playground.on('codeObjectDeleted', spy);

    playground.deleteCodeObject('nobody');

    expect(spy).not.to.have.been.called;
  });
});
