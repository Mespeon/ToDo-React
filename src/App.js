import React, { Component } from 'react';
import { Container, Typography, List, Checkbox, Button } from '@material-ui/core';

import './App.css';

class App extends Component {
  state = {
    tasks: []
  };

  // Handles the submission of the AddTask form.
  handleSubmit = task => {
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  // Handles the removal of an item in the App's state.
  handleDelete = (index) => {
    const newArr = [...this.state.tasks];
    newArr.splice(index, 1);
    this.setState({ tasks: newArr });
  }

  render() {
    return (
      <div id="wrapper">
        <Container maxWidth='md'>
          <Header count={this.state.tasks.length} />
          <TodoList tasks={this.state.tasks} onDelete={this.handleDelete} />
          <AddTask onFormSubmit={this.handleSubmit} />
        </Container>
      </div>
    );
  }
}

/*
Header component - accepts a custom prop to change texts depending on task count.

count - the current length of the task list
*/
const Header = (props) => {
  console.log(props.count);
  return (
    <div>
      <Typography variant='h3' component='h3' color='textPrimary'>
        What to do?
      </Typography>
      <Typography variant='h6' component='h6' color='textSecondary'>
        {
          props.count < 1 ?
          'You have no tasks listed. Try adding one now!' : 
          `You have ${props.count} ${props.count == 1 ? 'task' : 'tasks'} listed.`
        }
      </Typography>
    </div>
  )
}

/*
Task List component - accepts a custom prop for data and has a child component for items.
*/
const TodoList = (props) => {
  // Returns an array of Items with the given props.
  let todos = props.tasks.map((todo, index) => {
    return <Items content={todo} key={index} id={index} onDelete={props.onDelete} />
  })

  // Returns a List of Items.
  return (
    <div>
      <List>
        {todos}
      </List>
    </div>
  );
}

/*
Items component - accepts custom props for rendering its element as well as event handlers.
Parent: TodoList

- States -
complete - task completion status
edit - is task being edited or viewed?
text - the item text as given by parent
id - the item id as given by parent
*/
class Items extends Component {
  // Initial states
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      edit: false,
      text: this.props.content,
      id: this.props.id,
    }
  };

  toggleEdit = () => {
    this.setState({
      edit: !this.state.edit,
    });
  }

  // Updates item text.
  handleUpdate = (updatedText) => {
    this.setState({
      text: updatedText
    });
    
    this.toggleEdit();
  }

  toggleCompleted = () => {
    this.setState({
      complete: !this.state.complete
    })
  }

  render() {
    let update = this.state.text;
    return(
      <div id={this.state.id} className="list-item">
        <div className="item-label">
          {
            !this.state.edit ?
            <div>
              <Checkbox checked={this.state.complete} onChange={() => this.toggleCompleted()}></Checkbox>
              <span className={this.state.complete ? 'complete' : ''}>{this.state.text}</span>
            </div> :
            <div>
              <input type="text" id={this.state.id} name={this.props.id} defaultValue={this.state.text} onChange={(e) => { update = e.target.value }}></input>
            </div>
          }
        </div>

        <div className={`action-group ${this.state.complete ? 'hide' : ''}`}>
          <Button style={{ margin: "0px 5px 0px 5px" }} variant="outlined" color="primary" onClick={() => !this.state.edit ? this.toggleEdit() : this.handleUpdate(update)}>
            {this.state.edit === true ? 'Save' : 'Edit'}
          </Button>

          <Button style={{ margin: "0px 5px 0px 5px" }} variant="outlined" color="secondary" onClick={() => this.props.onDelete(this.state.id)}>
            Delete
          </Button>
        </div>
      </div>
    );
  }
}

/*
AddTask component - takes a user input then adds it to the App's state for task listing.
Not yet data persistent.

States
term - the text given by the user
*/
class AddTask extends Component {
  state = { term: '' };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.term === '') return;
    this.props.onFormSubmit(this.state.term);
    this.setState({ term: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          className='input'
          placeholder='Enter task details'
          value={this.state.term}
          onChange={(e) => this.setState({ term: e.target.value })}
        />
        <button id='submit-btn'>Add task</button>
      </form>
    );
  }
}

export default App;
