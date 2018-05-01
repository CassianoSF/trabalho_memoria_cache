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
    this.write        = this.write.bind(this)
    this.read         = this.read.bind(this)
    this.simulate         = this.simulate.bind(this)
    this.randomTrade = this.randomTrade.bind(this)


    this.state = {
          cache: this.generateCache(16, true),
           main: this.generateMain(256*4),
     statistics: {},
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

  simulate(read_or_write, sequential){
    [...Array(100).keys()].map((i, index) => {
      setTimeout( () => {
        this.setState({
          register: {
            address: sequential ? ("0000000000" + index.toString(2)).slice(-10) : ("0000000000" + parseInt(Math.random()*(2**10)).toString(2)).slice(-10),
            data: ("00" + parseInt(Math.random()*(2**8)).toString(16)).slice(-2).toUpperCase()
          }
        })
        read_or_write()
      }, index * 100)
      return
    })
  }

  generateCache(n_blocks, cache){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
          tag: "", //("00000000" + index.toString(2)).slice(-8),
          ["00"]:  "", //("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2),
          ["01"]:  "", //("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2),
          ["10"]:  "", //("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2),
          ["11"]:  "", //("00" + Math.random().toString(16).substring(13).toUpperCase()).slice(-2)
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
      this.setState({
             cache: this.randomTrade(this.state.main, reg),
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
      reg = this.state.main.filter(cell => cell.address === reg.address)[0]
      this.setState({
             cache: this.randomTrade(this.state.main, reg),
          register: reg,
             reads: this.state.reads + 1,
       read_misses: this.state.read_misses + 1,
            misses: this.state.misses + 1
      })
    }
  }

  mergeMain(main, reg){
    return main.map(cell => (cell.address == reg.address) ? reg : cell)
  }

  mergeCache(cache, reg){
    return cache.map(frame => {
      if (frame.tag == reg.address.slice(0,8)){
        return update(frame, {[reg.address.slice(-2)]: {$set: reg.data}})
      }else{
        return frame
      }
    })
  }

  randomTrade(main, reg){
    let rand = parseInt(Math.random() * 16)
    return this.state.cache.map((frame, index) => {
      if(index === rand){
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
        <th>{block["00"]}</th>
        <th>{block["01"]}</th>
        <th>{block["10"]}</th>
        <th>{block["11"]}</th>
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
    console.log(this.state.main)
    console.log(this.state.cache)
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
