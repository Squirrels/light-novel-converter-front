import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeCover } from '../actions/story';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

class ChangeCover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            story_cover_url: '',
            errors: {},
            currently_updating: false
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
        this.setState({currently_updating: true});
        // Get id from url

        this.props.changeCover(this.props.match.params.id, this.state.story_cover_url, function(result){
            // Display form again
            this.setState({currently_updating: false});
            // Redirect
            this.props.history.push('/story/' + this.props.match.params.id);
        }.bind(this));
        this.setState({story_cover_url: ''})
    }

    render() {
        const { errors } = this.state;

        var addForm = (
            <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Change Story Cover</h2>
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="New Cover URL"
                        className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.story_cover_url
                        })}
                        name="story_cover_url"
                        onChange={ this.handleInputChange }
                        value={ this.state.story_cover_url }
                    />
                    {errors.story_cover_url && (<div className="invalid-feedback">{errors.story_cover_url}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Change
                    </button>
                </div>
            </form>
            </div>);
        var currentlyUpdating = this.state.currently_updating;
        return(
            
            <div className="story-data">
                {  !currentlyUpdating ? addForm : ''}
            </div>
        )
    }
}

ChangeCover.propTypes = {
    changeCover: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { changeCover })(withRouter(ChangeCover));