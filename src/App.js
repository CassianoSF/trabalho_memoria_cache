import React, { Component } from 'react';
import update from 'react-addons-update';
import {Jumbotron, Table, Container, Row, Col, FormGroup, Label, Input, Button} from 'reactstrap'
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
    this.write               = this.write.bind(this)
    this.read                = this.read.bind(this)
    this.simulate            = this.simulate.bind(this)
    this.randomTrade         = this.randomTrade.bind(this)
    this.clear               = this.clear.bind(this)


    this.state = {
          cache: this.generateCache(16, true),
           main: this.generateMain(256*4),
       register: {address: "0000000000", data: "FF"},
           hits: 0,
      read_hits: 0,
     write_hits: 0,
         misses: 0,
    read_misses: 0,
   write_misses: 0,
          reads: 0,
         writes: 0,
    }
  }

  clear(){
    this.setState({
           hits: 0,
      read_hits: 0,
     write_hits: 0,
         misses: 0,
    read_misses: 0,
   write_misses: 0,
          reads: 0,
         writes: 0,
    })
  }

  simulate(read_or_write, sequential){
    [...Array(100).keys()].map((i, index) => {
      setTimeout( () => {
        this.setState({
          register: {
            address: ("0000000000" + (sequential ? index : parseInt(Math.random()*(2**10))).toString(2)).slice(-10),
            data: ("00" + parseInt(Math.random()*(2**8)).toString(16)).slice(-2).toUpperCase()
          }
        })
        read_or_write()
      }, index * 100)
    })
  }

  generateCache(n_blocks, cache){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
             tag: "",
          ["00"]: "",
          ["01"]: "",
          ["10"]: "",
          ["11"]: "",
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
    let on_cache =  this.state.cache.filter(frame => frame.tag === reg.address.slice(0,8))[0]

    //HIT
    if (on_cache){
      this.setState({
             cache: this.mergeCache(this.state.cache, reg),
              main: this.mergeMain(this.state.main, reg),
            writes: this.state.writes + 1,
        write_hits: this.state.write_hits + 1,
              hits: this.state.hits + 1
      })
    }

    //MISS
    else{
      let free = this.state.cache.map((frame, index) => frame.tag[0] ? null : index ).filter(i => Number.isInteger(i))[0]
      this.setState({
             cache: this.randomTrade(this.state.main, reg, free),
              main: this.mergeMain(this.state.main, reg),
            writes: this.state.writes + 1,
      write_misses: this.state.write_misses + 1,
            misses: this.state.misses + 1
      })
    }
  }

  read(){
    let reg = this.state.register
    let on_cache =  this.state.cache.filter(frame => frame.tag === reg.address.slice(0,8))[0]

    //HIT
    if (on_cache){ 
      this.setState({
          register: {address: reg.address, data: on_cache[reg.address.slice(-2)]},
             reads: this.state.reads + 1,
         read_hits: this.state.read_hits + 1,
              hits: this.state.hits + 1
      })
    }

    //MISS
    else {
      let free = this.state.cache.map((frame, index) => frame.tag[0] ? null : index ).filter(i => Number.isInteger(i))[0]
      reg = this.state.main.filter(cell => cell.address === reg.address)[0]
      this.setState({
             cache: this.randomTrade(this.state.main, reg, free),
          register: reg,
             reads: this.state.reads + 1,
       read_misses: this.state.read_misses + 1,
            misses: this.state.misses + 1
      })
    }
  }

  mergeMain(main, reg){
    return main.map(cell => (cell.address === reg.address) ? reg : cell)
  }

  mergeCache(cache, reg){
    return cache.map(frame => {
      if (frame.tag === reg.address.slice(0,8)){
        return update(frame, {[reg.address.slice(-2)]: {$set: reg.data}})
      }else{
        return frame
      }
    })
  }

  randomTrade(main, reg, free){
    let rand = parseInt(Math.random() * 16)
    return this.state.cache.map((frame, index) => {
      if(index === (Number.isInteger(free) ? free : rand)){
        let new_frame = {
          tag: reg.address.slice(0,8), 
          ["00"]: main[ parseInt((reg.address.slice(0,8) + "00"), 2)].data,
          ["01"]: main[ parseInt((reg.address.slice(0,8) + "01"), 2)].data,
          ["10"]: main[ parseInt((reg.address.slice(0,8) + "10"), 2)].data,
          ["11"]: main[ parseInt((reg.address.slice(0,8) + "11"), 2)].data
        }
        return update(new_frame, {[reg.address.slice(-2)]: {$set: reg.data}}) 
      } else{
        return frame
      }
    })
  }

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

  frame(block){
    let val = parseInt(block.tag, 2)
    return (
      <tr style={this.style(val)}>
        <th>{block.tag}</th>
        <th>{block["00"]}</th>
        <th>{block["01"]}</th>
        <th>{block["10"]}</th>
        <th>{block["11"]}</th>
      </tr>
    )
  }

  cell(cell){
    let val = parseInt(parseInt(cell.address, 2)/4)
     return (
      <tr style={this.style(val)}>
        <th>{cell.address}</th>
        <th>{cell.data}</th>
      </tr>
    )
  }

  style(val){
    let r = val
    let g = 50 - val
    let b = 33
    return { backgroundColor: "rgba(" + r +","+ g +","+ b + ", 1)" }
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
              <ListGroupItem>Numero de escritas:           {this.state.writes}</ListGroupItem>
              <ListGroupItem>Numero de acertos na leitura: {this.state.read_hits}</ListGroupItem>
              <ListGroupItem>Numero de acertos na escrita: {this.state.write_hits}</ListGroupItem>
              <ListGroupItem>Numero de falhas na leituras: {this.state.read_misses}</ListGroupItem>
              <ListGroupItem>Numero de falhas na escrita:  {this.state.write_misses}</ListGroupItem>
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
                    <Button onClick={this.clear} className="m-2">Clear Statistics</Button>
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
