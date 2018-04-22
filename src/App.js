import React, { Component } from 'react';

import {Jumbotron, Table, Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap'
import  { ListGroup, ListGroupItem }  from 'reactstrap'

class App extends Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.generate = this.generate.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onDrop = this.onDrop.bind(this)


    this.state = {
      cache: this.generate(16),
      principal: this.generate(256),
      estatisticas: {},
      endereco_leitura: '',
      endereco_escrita: '',
      Data: ''
    } 

  }

  generate(n_blocks){
    return [...Array(n_blocks).keys()].map( (i, index) =>  { return (
      {
          tag: ("00000000" + index.toString(2)).slice(-8),
          words: [...Array(1).keys()].map(i => Math.random().toString(16).substring(7).toUpperCase() )
      }
    )})
  }

  read(){

  }

  write(){

  }

  statistics(){

  }

  onDrag(event){
  }

  onDrop(event){
    console.log(event.target)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  word(word, block){
    return(<th block={block.tag}>{word}</th>)
  }

  block(block, type){
    let tag_n = parseInt(block.tag, 2)
    let r = tag_n
    let g = 50 - tag_n
    let b = 33
    let style = { backgroundColor: "rgba(" + r +","+ g +","+ b + ", 1)"
    } 
    return (
        <tr draggable="true" style={style} onDrag={this.onDrag} onDrop={this.onDrop}>
            <th block={block.tag}>{block.tag}</th>
            {block.words.map(word => this.word(word, block))}
        </tr>
    )
  }

  render() {
    return (
        <Container>
            <Jumbotron>
                <Form>
                	<Row>
	                	<Col/>
	                	<Col md="4">
		                    <FormGroup>
		                        <Input 
		                            type="text" 
		                            name="endereco_leitura" 
		                            placeholder="Tag" 
		                            value={this.state.endereco_leitura} 
		                            onChange={this.handleChange} 
		                        />
		                    </FormGroup>
		                    <Button>Ler</Button>
	                	</Col>
	                	<Col/>
	                	<Col md="4">
		                    <FormGroup>
		                        <Input 
		                            type="text" 
		                            name="endereco_escrita" 
		                            placeholder="Tag" 
		                            value={this.state.endereco_escrita} 
		                            onChange={this.handleChange}
		                        />
		                        <Input 
		                            type="text" 
		                            name="Data" 
		                            placeholder="Data" 
		                            value={this.state.Data} 
		                            onChange={this.handleChange}
		                        />
		                    </FormGroup>
		                    <Button>Escrever</Button>
	                	</Col>
	                	<Col/>
	                </Row>
                </Form>
            </Jumbotron>
            <Row>
                <Col md={{size:"4", offset: 0}}>
                	<Jumbotron>
	                    <h4>Memoria Cache</h4>
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
                  <h4>Estatísticas</h4>
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
                </Col>

                <Col md={{size:"4", offset: 0}}>
                	<Jumbotron>
	                    <h4>Memoria Principal</h4>
	                    <Table>
	                        <thead>
	                            <tr>
	                                <th>Tag</th>
	                                <th>Data</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            {this.state.principal.map(block => this.block(block, "principal"))}
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
