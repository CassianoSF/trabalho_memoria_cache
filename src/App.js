import React, { Component } from 'react';

import {Jumbotron, Table, Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap'
import  { ListGroup, ListGroupItem }  from 'reactstrap'

class App extends Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.generate     = this.generate.bind(this)
    this.onDragOver   = this.onDragOver.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onDrag       = this.onDrag.bind(this)
    this.onMouseDown  = this.onMouseDown.bind(this)
    this.onMouseUp    = this.onMouseUp.bind(this)


    this.state = {
      cache: this.generate(16),
      main: this.generate(256),
      statistics: {},
      over:     {tag: null, data: null},
      register: {tag: null, data: null}
    } 

  }

  generate(n_blocks){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
          tag: ("00000000" + index.toString(2)).slice(-8),
          data: Math.random().toString(16).substring(7).toUpperCase()
      }
    )})
  }

  write(){
    this.randomTrade(this.state.register)
    let new_state = this.state.main.map((same_block) => {
      if (same_block.tag === this.state.over.tag){
        return {tag: this.state.over.tag, data: this.state.register.data}
      }else{
        return same_block
      }
    })
    this.setState({
      main: new_state
    })
  }

  read(){
    let reg_tag = this.state.register.tag

    //HIT
    let on_cache = this.state.cache.filter(i => i.tag === reg_tag)[0]
    if (on_cache){ 

    }
    //MISS
    else { 
      this.randomTrade(this.state.main.filter(i => i.tag === reg_tag)[0])
    }
  }

  randomTrade(new_block){
    let rand = parseInt(Math.random() * 16)
    let new_state = this.state.cache.map((same_block, index) => {
      if (index === rand){
        return new_block
      }else{
        return same_block
      }
    })
    this.setState({
      cache: new_state,
      register: new_block
    })
  }

  onDragOver(block, type){
    this.setState({
      over: block,
      type: type
    })
  }

  onDrag(block){
    this.setState({
      register: block
    })
  }

  onDragEnd(block, type){
    if(type !== this.state.type){
      if(type === "main"){
        this.read()
      }else{
        this.write()
      }
    }
  }

  onMouseDown(block, type){
    this.setState({
      register: block
    })
  }

  onMouseUp(block, type){
    this.read()
  }

  handleChange(event) {
    this.setState({
      register: {
        [event.target.name]: event.target.value
      }
    });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  word(block){
    return(<th block={block.tag}>{block.data}</th>)
  }

  block(block, type){
    let tag_n = parseInt(block.tag, 2)
    let r = tag_n
    let g = 50 - tag_n
    let b = 33
    let style = { backgroundColor: "rgba(" + r +","+ g +","+ b + ", 1)" } 
    return (
        <tr block={block.tag} 
            draggable="true" 
            style={style} 
            onDragOver={() => this.onDragOver(block, type)}
            onDragEnd={() =>  this.onDragEnd(block, type)}
            onDrag={() => this.onDrag(block)}
            onMouseDown={() => this.onMouseDown(block)}
            onMouseUp={() => this.onMouseUp(block)}

            >

          <th>{block.tag}</th>
          {this.word(block)}
        </tr>
    )
  }

  render() {
    console.log(this.state.register)
    return (
        <Container>
            <h4>Statistics</h4>
            <ListGroup>
              <ListGroupItem>Numero de acessos:</ListGroupItem>
              <ListGroupItem>Numero de acertos:</ListGroupItem>
              <ListGroupItem>Numero de falhas:</ListGroupItem>
              <ListGroupItem>Numero de leituras:</ListGroupItem>
              <ListGroupItem>Numero de escritas:</ListGroupItem>
              <ListGroupItem>Numero de acertos na leitura:</ListGroupItem>
              <ListGroupItem>Numero de acertos na escrita:</ListGroupItem>
              <ListGroupItem>Numero de falhas na leituras:</ListGroupItem>
              <ListGroupItem>Numero de falhas na escrita:</ListGroupItem>
            </ListGroup>
            <Row className="m-4">

                <Col md={{size:"4", offset: 0}}>
                  <Jumbotron>
                    <h4>Read/Write</h4>
                    <FormGroup>
                      <Label className="m-4" for="examplePassword">Tag</Label>
                      <Input onChange={this.handleChange} value={this.state.register.tag} type="text" name="tag" placeholder="00010101" />
                      <Label className="m-4" for="examplePassword">Data</Label>
                      <Input onChange={this.handleChange} value={this.state.register.data} type="text" name="data" placeholder="10F2A422" />
                    </FormGroup>
                    <Button className="m-2">Read</Button>
                    <Button className="m-2">Write</Button>
                    <Button className="m-2">Simulate</Button>
                  </Jumbotron>
                </Col>
            
                <Col md={{size:"4", offset: 0}}>
                  <Jumbotron>
                      <h4>Cache Memory</h4>
                      <Table>
                          <thead>
                              <tr>
                                  <th>Tag</th>
                                  <th>Data</th>
                              </tr>
                          </thead>
                          <tbody>
                              {this.state.cache.map(block => this.block(block, "cache"))}
                          </tbody>
                      </Table>
                  </Jumbotron>

                </Col>

                <Col md={{size:"4", offset: 0}}>
                	<Jumbotron>
	                    <h4>Main Memory</h4>
	                    <Table>
	                        <thead>
	                            <tr>
	                                <th>Tag</th>
	                                <th>Data</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            {this.state.main.map(block => this.block(block, "main"))}
	                        </tbody>
	                    </Table>
                	</Jumbotron>
                </Col>
            </Row>
        </Container>
    );
  }
}

export default App;
