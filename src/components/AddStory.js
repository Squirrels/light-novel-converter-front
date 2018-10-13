import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addStory } from '../actions/story';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

class AddStory extends Component {
    constructor() {
        super();
        this.state = {
            story_url: '',
            errors: {},
            story_data: {},
            currently_adding: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit(e) {
        // Clean form
        e.preventDefault();
        // Disable the form
        this.setState({currently_adding: true});
        this.props.addStory(this.state.story_url, function(result){
            // Display form again
            this.setState({story_data: result});
            this.setState({currently_adding: false});
        }.bind(this));
        this.setState({story_url: ''})
    }

    render() {
        const { errors } = this.state;
        var story_data = this.state.story_data;
        var story_html;
        if(Object.keys(story_data).length !== 0){
            story_html = <div className="">{story_data.title} [{story_data.chapters.length} chapters] ({story_data.url})</div>;
        }
        var addForm = (
            <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Add Story</h2>
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Story URL"
                        className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.story_url
                        })}
                        name="story_url"
                        onChange={ this.handleInputChange }
                        value={ this.state.story_url }
                    />
                    {errors.story_url && (<div className="invalid-feedback">{errors.story_url}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Add
                    </button>
                </div>
            </form>
            </div>);
        var currentlyAdding = this.state.currently_adding;
        return(
            
            <div className="story-data">
                {  !currentlyAdding ? addForm : ''}
                { story_html}
            </div>
        )
    }
}

AddStory.propTypes = {
    addStory: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { addStory })(withRouter(AddStory));