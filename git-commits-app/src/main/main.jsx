import React, { Component } from 'react';
import moment from 'moment/moment.js';
import Timer from './timer.jsx';
import './main.css';

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authKey: '',
            ownerName: 'Akpatangay',
            repo: 'git-commits-assignment',
            commits: [],
            startTimer: false,
            error: false
        }
    }

    componentDidMount() {
        // get data from localstorage if exists and save it locally
        let data = localStorage.getItem('gitDetails');
        if(data) {
            this.setState({...JSON.parse(data)})
            this.saveDetails();
        }
    }

    saveDetails=()=>{
        this.setState({startTimer: false}, ()=>{
            if(
                this.state.authKey.trim() && 
                this.state.ownerName.trim() &&
                this.state.repo.trim()
            ) {
                // make api call
                this.fetchCommitsFromApi()
            }
        })
    }

    renderTime=(time)=>{
        let t = new Date(time);
        return `${moment(t).format('MMMM')} ${t.getDate()}, ${moment(t).format('HH:mm A')}`
    }

    fetchCommitsFromApi = () => {   
        fetch(`https://api.github.com/repos/${this.state.ownerName}/${this.state.repo}/commits`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${this.state.authKey}`}
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw 'Error getting users list'
            }
        }).then((data) => {
            let obj = {
                authKey: this.state.authKey,
                ownerName: this.state.ownerName,
                repo: this.state.repo
            }
            // store in localStorage if success
            localStorage.setItem('gitDetails', JSON.stringify(obj));
            this.setState({commits: data, startTimer: true, error: false})
        }).catch((e) => {
            // show error alert
            if(!this.state.error) {
                this.setState({error: true, commits: []})
            }
            console.log('There has been a problem with your fetch operation: ' + e.message);
        })
    }

    renderCommitsList=()=>{
        return this.state.commits.map((commit, index)=>{
            return (
                <div className='commit-card' key={index}>
                    <div className='commitName'>{commit.commit.message}</div>
                    <div className='commitDetails'>
                        <span className='time'>
                            {this.renderTime(commit.commit.author.date)}
                        </span>
                        <span className='author'>{` by ${commit.commit.author.name}`}</span>
                    </div>
                </div>
            )
        })
    }

    render() {
        return (
            <div className='main-container'>
                <div className='main-header'>
                    <div>
                        <label>
                            <span className='input-name'>Access Key</span>
                            <input 
                                value={this.state.authKey} 
                                name='key' 
                                type='text'
                                onChange={(e)=>this.setState({authKey: e.target.value})} 
                                placeholder='Enter Key...' 
                            />
                        </label>
                        {/* <label>
                            <span className='input-name'>Github Owner name</span>
                            <input 
                                value={this.state.ownerName} 
                                name='key' 
                                type='text' 
                                onChange={(e)=>this.setState({ownerName: e.target.value})} 
                                placeholder='Enter name...' 
                            />
                        </label>
                        <label>
                            <span className='input-name'>Github Repo Name</span>
                            <input 
                                value={this.state.repo} 
                                name='key' 
                                type='text' 
                                onChange={(e)=>this.setState({repo: e.target.value})} 
                                placeholder='Enter repo...' 
                            />
                        </label> */}
                        <input onClick={this.saveDetails} type='submit' />
                        <Timer start={this.state.startTimer} fetchDetails={this.saveDetails} />
                    </div>
                </div>
                <div className='main-body'>
                    <div className='content'>
                        {this.state.commits.length>0 ? 
                            this.renderCommitsList()
                        : 
                            this.state.error ? 
                                <span className='error'>Please provide correct git details</span>
                            :    
                                <span>Your commits will be shown here</span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
