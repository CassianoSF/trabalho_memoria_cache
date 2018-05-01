import React, { Component } from 'react';
import update from 'react-addons-update';
import {Jumbotron, Table, Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap'
import  { ListGroup, ListGroupItem }  from 'reactstrap'

class App extends Component {
  constructor(props){
    super(props);

    // this.onDragEnter  = this.onDragEnter.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    // this.onMouseDown  = this.onMouseDown.bind(this)
    // this.onMouseUp    = this.onMouseUp.bind(this)
    

    this.handleChangeAddress = this.handleChangeAddress.bind(this)
    this.handleChangeData    = this.handleChangeData.bind(this)
    this.write        = this.write.bind(this)
    this.read         = this.read.bind(this)
    this.simulate         = this.simulate.bind(this)


    this.state = {
          cache: this.generateCache(16, true),
           main: this.generateMain(256*4),
     statistics: {},
       register: {address: "0000000000", data: "FF"},
           hits: 0,
         misses: 0,
          reads: 0,
         writes: 0,
    }
  }

  simulate(read_or_write, sequential){
    [...Array(20).keys()].map((i, index) => {
      setTimeout( () => {
        this.setState({
          register: {
            address: sequential ? ("0000000000" + index.toString(2)).slice(-10) : ("0000000000" + parseInt(Math.random()*(2**10)).toString(2)).slice(-10),
            data: ("00" + parseInt(Math.random()*(2**8)).toString(16)).slice(-8).toUpperCase()
          }
        })
        read_or_write()
      }, index * 100)
    })
  }

  generateCache(n_blocks, cache){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
          tag: ("00000000" + index.toString(2)).slice(-8),
          d0: ("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2),
          d1: ("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2),
          d2: ("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2),
          d3: ("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2)
      }
    )})
  }

  generateMain(n_blocks){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
          address: ("0000000000" + index.toString(2)).slice(-10),
          data: ("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2)
      }
    )})
  }

  write(){
    let reg = this.state.register
    if (!this.state.cache.filter(i => i.tag === reg.tag.slice(0,8))[0]){
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

  merge(memory, reg){
    return memory.map(block => (block.tag == reg.tag.slice(0,8)) ? reg : block)
  }

  randomTrade(new_block){
    let rand = parseInt(Math.random() * 16)
    this.setState({
      cache: this.state.cache.map((block, index) => (index === rand) ? new_block : block ),
      register: new_block
    })
  }

  // onDragEnter(event, block, type){
  //   this.setState({
  //     type: type,
  //     register: {tag: block.tag, data: this.state.register.data}
  //   })
  // }

  // onDragEnd(block, type){
  //   if(type !== this.state.type){
  //     if(type === "main"){
  //       this.read()
  //     }else{
  //       this.write()
  //     }
  //   }
  // }

  // onMouseDown(block, type){
  //   this.setState({
  //     register: block
  //   })
  // }

  // onMouseUp(block, type){
  //   this.read()
  // }
  
  handleChangeAddress(event) {
    let value = ("0000000000" + event.target.value.match(/[0-1]{0,11}/g)[0].toUpperCase()).slice(-10)
    this.setState({
      register: update(this.state.register, {[event.target.name]: {$set: value}})
    });
  }

  handleChangeData(event) {
    let value = ("00" + event.target.value.match(/[0-9A-Fa-f]{0,3}/g)[0].toUpperCase()).slice(-2)
    this.setState({
      register: update(this.state.register, {[event.target.name]: {$set: value}})
    });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  frame(block){
    let tag_n = parseInt(block.tag, 2)
    let r = tag_n
    let g = 50 - tag_n
    let b = 33
    let style = { backgroundColor: "rgba(" + r +","+ g +","+ b + ", 1)" }
    return (
      <tr block={block.tag} 
          draggable="true" 
          style={style} 
          onDragEnter={(event) => this.onDragEnter(event, block, "cache")}
          onDragEnd={() =>  this.onDragEnd(block, "cache")}
          onMouseDown={() => this.onMouseDown (block)}
          onMouseUp={() => this.onMouseUp (block)}
          >
        <th>{block.tag}</th>
        <th>{block.d0}</th>
        <th>{block.d1}</th>
        <th>{block.d2}</th>
        <th>{block.d3}</th>
      </tr>
    )
  }

  cell(cell){
    let tag_n = parseInt(parseInt(cell.address, 2)/4)
    let r = tag_n
    let g = 50 - tag_n
    let b = 33
    let style = { backgroundColor: "rgba(" + r +","+ g +","+ b + ", 1)" }
     return (
      <tr cell={cell.address} 
          draggable="true" 
          style={style} 
          onDragEnter={(event) => this.onDragEnter(event, cell, "main")}
          onDragEnd={() =>  this.onDragEnd(cell, "main")}
          onMouseDown={() => this.onMouseDown (cell)}
          onMouseUp={() => this.onMouseUp (cell)}
          >
        <th>{cell.address}</th>
        <th>{cell.data}</th>
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
                      <Label className="m-4" for="examplePassword">Address</Label>
                      <Input onKeyPress={(e) => e.key === 'Enter' ? this.read() : null } onChange={this.handleChangeAddress} value={this.state.register.address} type="text" name="address" />
                      <Label className="m-4" for="examplePassword">Data</Label>
                      <Input onKeyPress={(e) => e.key === 'Enter' ? this.write() : null } onChange={this.handleChangeData} value={this.state.register.data} type="text" name="data" />
                    </FormGroup>
                    <Button onClick={this.read} className="m-2">Read</Button>
                    <Button onClick={this.write} className="m-2">Write</Button>
                    <Button onClick={() => this.simulate(this.read, true)} className="m-2">Seguential reads</Button>
                    <Button onClick={() => this.simulate(this.write, true)} className="m-2">Seguential writes</Button>
                    <Button onClick={() => this.simulate(this.read, false)} className="m-2">Random reads</Button>
                    <Button onClick={() => this.simulate(this.write, false)} className="m-2">Random writes</Button>
                  </Jumbotron>
                </Col>
            
                <Col md={{size:"4", offset: 0}}>
                  <Jumbotron>
                      <h4>Cache Memory</h4>
                      <Table>
                        <thead>
                          <tr>
                            <th>Tag</th>
                            <th>D0</th>
                            <th>D1</th>
                            <th>D2</th>
                            <th>D3</th>
                          </tr>
                        </thead>
                        <tbody>
                            {this.state.cache.map(frame => this.frame(frame))}
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
                            <th>Address</th>
                            <th>Data</th>
                          </tr>
                        </thead>
                        <tbody>
                            {this.state.main.map(cell => this.cell(cell))}
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
