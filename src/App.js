import React, { Component } from 'react';

import {Container, Row, Col} from 'reactstrap'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      cache: [...Array(8).keys()].map( (i, index) =>  { return (
        {
            endereco: index,
            palavras: [...Array(4).keys()].map(i => Math.random().toString(36).substring(7) )
        }
      )}
      ),
      principal:[...Array(256).keys()].map( (i, index) =>  { return (
        {
            endereco: index,
            palavras: [...Array(4).keys()].map(i => Math.random().toString(36).substring(7) )
        }
      )}
      ),
      estatisticas: {}
    } 
  }





  desenho_palavra(palavra){
    let style = { boxShadow: "0 0 3px 0px black", color: "white", textAlign: "center" }
    return(<Col style={style}>{palavra}</Col>)
  }

  desenho_bloco(bloco){
    let style = { backgroundColor: "steelblue", height: "", width: "490px" }
    let style_address = { boxShadow: "0 0 3px 0px black", color: "white", textAlign: "center" }
    return (
        <Row style={style}>
            <Col style={style_address}>{bloco.endereco}</Col>
            {bloco.palavras.map(cel => this.desenho_palavra(cel))}
        </Row>
    )
  }

  render() {
    return (
      <Container>
         <div style={{height: "50px"}}/>
         <Row>
           <Col>
              <h4>Memoria Cache</h4>
              {this.state.cache.map(bloco => this.desenho_bloco(bloco))}

             <div style={{ textAlign: "center", color: "white", backgroundColor: "steelblue", marginTop: "100px", height: "500px", width: "490px", boxShadow: "0 0 3px 0px black"}}>
              <h4>Estatísticas</h4>
              <Row style={{display: "block"} }>{"Numero de acessos: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de acertos: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de falhas: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de leituras: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de escritas: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de acertos na leitura: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de acertos na escrita: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de falhas na leituras: 123"}</Row>
              <Row style={{display: "block"} }>{"Numero de falhas na escrita: 123"}</Row>
             </div>
           </Col>
           <Col/>
           <Col/>
           <Col>
            <h4>Memoria Principal</h4>
             {this.state.principal.map(bloco => this.desenho_bloco(bloco))}
           </Col>
         </Row>
      </Container>
    );
  }
}

export default App;
