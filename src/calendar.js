import React from 'react'
import moment from 'moment'
import testevents from './events'
import BigCalendar from 'react-big-calendar'
import Modal from 'react-modal'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/less/styles.less'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    width                 : '25%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      current_user: 'rodaan.rabang@gmail.com',
      modalIsOpen: false,
      selectedEmployer: '',
      start_date: '',
      end_date: '',
      title: '',
      allDay: false,
      selectedEvent: '',
    };
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.componentDidMount = this.componentWillMount.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }

  componentWillMount(){
    fetch(`http://localhost:4000/events?email=${this.state.current_user}`)
    .then((response) => response.json())
    .then((events) => {
      console.log(events);
      const updatedEventsList = [];
      let obj, startDate, endDate;
      for(let i = 0; i < events.length; i++){
        console.log(events[i])
        obj = {};
        startDate = moment(events[i].start_date)
        endDate = moment(events[i].end_date)
        obj.allDay = events[i].allDay || false;
        obj.id = events[i]._id;
        obj.title = events[i].title || `${events[i].type} - ${events[i].employer_email}`;
        obj.start = new Date(events[i].start_date);
        obj.end = new Date(events[i].end_date);
        updatedEventsList.push(obj);
      }
      this.setState({events: updatedEventsList}, function(){
        console.log(this.state.events)
      });
    });
  }
  onSelectEvent(event){
    console.log('something');
    console.log(event);
    this.setState({selectedEvent: event.id, });
  }

  onSelectSlot(slot){
    // open modal
    console.log(slot);
    this.openModal(slot)
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedEmployer: selectedOption.value });
    console.log(`Selected: ${selectedOption}`);
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value }, function(){
      console.log(this.state);
    });
  }

  handleStartChange = (event) => {
    this.setState({ selectedEmployer: event.target.value });
  }
  handleEndChange = (event) => {
    this.setState({ selectedEmployer: event.target.value });
  }

  openModal(slot) {
    this.setState({modalIsOpen: true, start_date: slot.start, end_date: slot.end});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  createEvent(){
    console.log('woot');
    const startDate = JSON.stringify(this.state.start_date);
    const endDate = JSON.stringify(this.state.end_date);
    fetch('http://localhost:4000/events', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'meeting',
        title: this.state.title,
        start_date: startDate.substr(1, startDate.length - 2),
        end_date: endDate.substr(1, startDate.length - 2),
        candidate_email: this.state.current_user,
        employer_email: this.state.selectedEmployer,
        allDay: this.state.allDay,
        status: 'pending' 
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      const obj = {};
      const startDate = moment(responseJson.start_date)
      const endDate = moment(responseJson.end_date)
      obj.allDay = responseJson.allDay || false;
      obj.id = responseJson._id;
      obj.title = responseJson.title || `${responseJson.type} - ${responseJson.employer_email}`;
      obj.start = new Date(responseJson.start_date);
      obj.end = new Date(responseJson.end_date);
      const eventslist = this.state.events;
      eventslist.push(obj);
      this.setState({events: eventslist}, () => {
        this.closeModal();
      });
    })
    .catch((error) => {
      console.error(error);
    }); 
  }

  cancelEvent(){
    console.log('woot');
    const startDate = JSON.stringify(this.state.start_date);
    const endDate = JSON.stringify(this.state.end_date);
    fetch('http://localhost:4000/events', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'meeting',
        title: this.state.title,
        start_date: startDate.substr(1, startDate.length - 2),
        end_date: endDate.substr(1, startDate.length - 2),
        candidate_email: this.state.current_user,
        employer_email: this.state.selectedEmployer,
        allDay: this.state.allDay,
        status: 'cancel' 
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    }); 
  }

  render(){
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    return(
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h3 ref={subtitle => this.subtitle = subtitle}>New Event</h3>
          <div>
            <p>Title:</p>
            <input onChange={this.handleTitleChange}/>
            <p>Start Date:</p>
            <input onChange={this.handleStartChange} value={this.state.start_date}/>
            <p>End Date:</p>
            <input onChange={this.handleEndChange} value={this.state.end_date}/>
            <p>Employer:</p>
            <Select
              name="form-field-name"
              value={value}
              onChange={this.handleChange}
              options={[
                { value: 'april@10by10.io', label: 'April Chang' },
                { value: 'noah@10by10.io', label: 'Noah' },
              ]}
            />
            <button onClick={this.closeModal}>Close</button>
            <button onClick={this.createEvent}>Confirm</button>
            <button onClick={this.cancelEvent}>Cancel</button>
          </div>
        </Modal>
        <BigCalendar
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          onSelectEvent={this.onSelectEvent}
          onSelectSlot={this.onSelectSlot}
          defaultView="week"
          defaultDate={new Date()}
        />
      </div>
    )
}};

export default Calendar;