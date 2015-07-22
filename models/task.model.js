var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date

});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
  if(!this.due) return Infinity;
  return this.due - Date.now();
});

TaskSchema.virtual('overdue').get(function() {
  if((this.due - Date.now()) < 0){
    return true;
  }
  return false
});

//methods

TaskSchema.methods.addChild = function(params) {
  var task =  new Task(params);
  task.parent = this._id;
  return task.save();

};

TaskSchema.methods.getChildren = function() {
  return Task.find({parent: this._id}).exec();
};

TaskSchema.methods.getSiblings = function() {
  return Task.find({parent: this.parent, _id:{$ne: this._id}});
};

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;