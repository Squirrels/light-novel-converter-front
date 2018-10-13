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


    render() {
      var storiesData = this.state.stories;
      const stories = (
            <ul className="">
                {   storiesData.map(story => <li key={ story.id }>{story.title} [{story.chapters.length} chapters]({story.url})</li>)}
            </ul>
        );
        return(
            <div className="" id="storyList">
                <button onClick = {this.handleClick}>Refresh Stories</button>
                {stories}
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