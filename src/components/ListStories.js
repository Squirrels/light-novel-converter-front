import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { listStories } from '../actions/story';
import { withRouter } from 'react-router-dom';

class ListStories extends Component {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.state = {stories: []}
    }

    handleClick(e) {
        e.preventDefault();
        this.refreshStories();
    }

    componentDidMount() {
        this.refreshStories();
    }

    refreshStories(){
        this.props.listStories(function(result){
                this.setState({stories: result});
        }.bind(this));
    }

    displayStory(story, index){
        return(
            <tr key={ story.id }>
                <td>{ index+1 }</td>
                <td><a href={ "/story/" + story.id }>{ story.title }</a></td>
                <td>{ story.chapter_count }</td>
                <td>{ story.updatedAt }</td>
            </tr>
        )
    }

    render() {
      var storiesData = this.state.stories;
      console.log(storiesData);
      //
      const stories = (
            <table >
              <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Number of chapters</th> 
                <th>Last Updated</th>
              </tr>
              </thead>
              <tbody>
                { storiesData.map((story, index) =>  this.displayStory(story, index) ) }
              </tbody>
            </table>
        );
        return(
            <div className="" id="storyList">
                <button onClick = { this.handleClick }>Refresh Stories</button>
                { stories }
            </div>
        )
    }
}
ListStories.propTypes = {
    listStories: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { listStories })(withRouter(ListStories));