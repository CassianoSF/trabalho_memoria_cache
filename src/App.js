import React, { Component } from 'react';
import update from 'react-addons-update';
import {Jumbotron, Table, Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap'
import  { ListGroup, ListGroupItem }  from 'reactstrap'

class App extends Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.generate     = this.generate.bind(this)
    this.onDragEnter  = this.onDragEnter.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onMouseDown  = this.onMouseDown.bind(this)
    this.onMouseUp    = this.onMouseUp.bind(this)
    this.write        = this.write.bind(this)
    this.read         = this.read.bind(this)

    this.state = {
          cache: this.generate(16, true),
           main: this.generate(256, false),
     statistics: {},
       register: {tag: "00000000", data: "FFFFFFFF"},
           hits: 0,
         misses: 0,
          reads: 0,
         writes: 0,
    }
  }

  generate(n_blocks, cache){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
          tag: cache ? "" : ("00000000" + index.toString(2)).slice(-8),
          data: cache ? "" : Math.random().toString(16).substring(7).toUpperCase()
      }
    )})
  }

  write(){
    let reg = this.state.register
    if (!this.state.cache.filter(i => i.tag === reg.tag)[0]){
      this.randomTrade(reg)
    }else{
      this.setState({
        cache: this.merge(this.state.cache, reg)
      })
    }
    this.setState({
      main: this.merge(this.state.main, reg),
      writes: this.state.writes + 1
    })
  }

  merge(memory, reg){
    return memory.map(block => (block.tag == reg.tag) ? reg : block)
  }

  read(){
    let reg_tag = this.state.register.tag
    let on_cache = this.state.cache.filter(i => i.tag === reg_tag)[0]

    //HIT
    if (on_cache){ 
      let statistics = {reads: this.state.reads+1, hits: this.state.hits+1 }
      this.setState(statistics)
    }
    //MISS
    else { 
      this.randomTrade(this.state.main.filter(i => i.tag === reg_tag)[0])
      let statistics = {reads: this.state.reads+1, misses: this.state.misses+1 }
      this.setState(statistics)
    }
  }

  randomTrade(new_block){
    let rand = parseInt(Math.random() * 16)
    this.setState({
      cache: this.state.cache.map((block, index) => (index === rand) ? new_block : block ),
      register: new_block
    })
  }

  onDragEnter(event, block, type){
    this.setState({
      type: type,
      register: {tag: block.tag, data: this.state.register.data}
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


  handleErrors(target){
    return (
      (target.name==="tag" && target.value.split("").filter(i => i != "0" && i != "1")[0])
    )
  }
  
  handleChange(event) {
    let value = event.target.value.match(/[0-9A-Fa-f]{0,10}/g)[0].toUpperCase()
    let hex   = ("00000000" + value).slice(-8)
    if (!this.handleErrors(event.target)){
      this.setState({
        register: update(this.state.register, {[event.target.name]: {$set: hex}})
      });
    }
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
            onDragEnter={(event) => this.onDragEnter(event, block, type)}
            onDragEnd={() =>  this.onDragEnd(block, type)}
            onMouseDown={() => this.onMouseDown (block)}
            onMouseUp={() => this.onMouseUp (block)}

            >

          <th>{block.tag}</th>
          {this.word(block)}
        </tr>
    )
  }

  render() {
    return (
        <Container>
            <h4>Statistics</h4>
            <ListGroup>
              <ListGroupItem>Numero de acessos:            {this.state.reads + this.state.writes}</ListGroupItem>
              <ListGroupItem>Numero de acertos:            {this.state.hits} </ListGroupItem>
              <ListGroupItem>Numero de falhas:             {this.state.misses}</ListGroupItem>
              <ListGroupItem>Numero de leituras:           {this.state.reads} </ListGroupItem>
              <ListGroupItem>Numero de escritas:           {this.state.reads}</ListGroupItem>
              <ListGroupItem>Numero de acertos na leitura: {this.state.hits}</ListGroupItem>
              <ListGroupItem>Numero de acertos na escrita: {this.state.writes}</ListGroupItem>
              <ListGroupItem>Numero de falhas na leituras: {this.state.misses}</ListGroupItem>
              <ListGroupItem>Numero de falhas na escrita:  {0}</ListGroupItem>
            </ListGroup>
            <Row className="m-4">

                <Col md={{size:"4", offset: 0}}>
                  <Jumbotron>
                    <h4>Read/Write</h4>
                    <FormGroup>
                      <Label className="m-4" for="examplePassword">Tag</Label>
                      <Input onKeyPress={(e) => e.key === 'Enter' ? this.read() : null } onChange={this.handleChange} value={this.state.register.tag} type="text" name="tag" />
                      <Label className="m-4" for="examplePassword">Data</Label>
                      <Input onKeyPress={(e) => e.key === 'Enter' ? this.write() : null } onChange={this.handleChange} value={this.state.register.data} type="text" name="data" />
                    </FormGroup>
                    <Button onClick={this.read} className="m-2">Read</Button>
                    <Button onClick={this.write} className="m-2">Write</Button>
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
