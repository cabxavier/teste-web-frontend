import React from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';

class PontosTuristicos extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            idPontoTuristico: 0,
            nome: '',
            descricao: '',
            idEstado: 0,
            idCidade: 0,
            referencia: '',
            pontosTuristicos: [],
            pontosTuristicosFiltro: [],
            estados: [],
            cidades: [],
            modalAberta: false
        }
    };

    componentDidMount() {
        this.buscarPontoTuristico();
    };

    componentWillUnmount() {};

    buscarEstados = (idEstado) => {
        fetch("http://localhost:54303/api/" + idEstado + "/estados")
            .then(resposta => resposta.json())
            .then(dados => {
                this.setState({ estados: dados, cidades: [] })
            });
    };

    buscarCidades = (idEstado) => {
        fetch("http://localhost:54303/api/estados/" + idEstado + "/cidades")
            .then(resposta => resposta.json())
            .then(dados => {
                this.setState({ cidades: dados })
            });
    };

    buscarPontoTuristico = () => {
        fetch("http://localhost:54303/api/pontos-turisticos")
            .then(resposta => resposta.json())
            .then(dados => {
                this.setState({ pontosTuristicos: dados, pontosTuristicosFiltro: dados })
            });
    };

    cadastrarPontoTuristico = (pontoTuristico) => {
        fetch("http://localhost:54303/api/pontos-turisticos/novo",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pontoTuristico)
            })
            .then(resposta => {
                if (!resposta.ok) {
                    alert("Não foi possível cadastrar o ponto turístico! Error:" + resposta.statusText);
                }
                this.buscarPontoTuristico();
            });
    };

    carregarDadosPontoTuristico = (idPontoTuristico) => {
        fetch("http://localhost:54303/api/" + idPontoTuristico + "/pontos-turisticos", { method: 'GET' })
            .then(resposta => resposta.json())
            .then(dado => {
                this.setState({
                    idPontoTuristico: dado[0].idPontoTuristico,
                    nome: dado[0].nome,
                    descricao: dado[0].descricao,
                    idEstado: dado[0].idEstado,
                    idCidade: dado[0].idCidade,
                    referencia: dado[0].referencia
                });

                this.buscarEstados(0);
                this.buscarCidades(dado[0].idEstado);
                this.abrirModal();
            });
    };

    atualizarPontoTuristico = (pontoTuristico) => {
        fetch("http://localhost:54303/api/pontos-turisticos/atualizar/" + pontoTuristico.idPontoTuristico,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pontoTuristico)
            })
            .then(resposta => {
                if (!resposta.ok) {
                    alert("Não foi possível atualizar o ponto turístico! Error:" + resposta.statusText);
                }
                this.buscarPontoTuristico();
            });
    };

    deletarPontoTuristico = (idPontoTuristico) => {
        if (window.confirm("Deseja realmente excluir ?")) {
            fetch("http://localhost:54303/api/pontos-turisticos/" + idPontoTuristico + "/excluir", { method: 'DELETE' })
                .then(resposta => {
                    if (!resposta.ok) {
                        alert("Não foi possível excluir o ponto turístico! Error:" + resposta.statusText);
                    }
                    this.buscarPontoTuristico();
                });
        }
    };

    atualizarNome = (e) => {
        this.setState(
            {
                nome: e.target.value
            }
        );
    };

    atualizarDescricao = (e) => {
        this.setState(
            {
                descricao: e.target.value
            }
        );
    };

    atualizarReferencia = (e) => {
        this.setState(
            {
                referencia: e.target.value
            }
        );
    };

    atualizarIdEstado = (e) => {
        this.buscarCidades(e.target.value);

        this.setState(
            {
                idEstado: e.target.value
            }
        );
    }

    atualizarIdCidade = (e) => {
        this.setState(
            {
                idCidade: e.target.value
            }
        );
    }

    submit = () => {

        if (!this.state.nome) {
            alert("Informe o nome");
            document.getElementById('txtNome').focus();
            return false;
        }

        if (!this.state.descricao) {
            alert("Informe a descrição");
            document.getElementById('txtDescricao').focus();
            return false;
        }

        if (this.state.idEstado === 0) {
            alert("Informe o estado");
            document.getElementById('ddlEstado').focus();
            return false;
        }

        if (this.state.idCidade === 0) {
            alert("Informe o cidade");
            document.getElementById('ddlCidade').focus();
            return false;
        }

        const pontoTuristico = {
            idPontoTuristico: this.state.idPontoTuristico,
            nome: this.state.nome,
            descricao: this.state.descricao,
            idCidade: this.state.idCidade,
            referencia: this.state.referencia,
            dataIncluscao: ''
        }

        if (this.state.idPontoTuristico === 0) {
            this.cadastrarPontoTuristico(pontoTuristico);
        } else {
            this.atualizarPontoTuristico(pontoTuristico);
        }

        this.reset();

        this.fecharModal();
    };

    reset = () => {
        this.setState({
            idPontoTuristico: 0,
            nome: '',
            descricao: '',
            idEstado: 0,
            idCidade: 0,
            referencia: ''
        });

        this.buscarEstados(0);
        this.abrirModal();
    };

    abrirModal = () => {
        this.setState({
            modalAberta: true
        });
    };

    fecharModal = () => {
        this.setState({
            modalAberta: false
        });
    };

    filtroPontoTuristico = (e) => {
        const inputValue = e.target.value;
        const data = this.searchTable(inputValue, this.state.pontosTuristicos);
        this.setState({
            pontosTuristicos: data
        });
    }

    searchTable = (value, data) => {
        let tabelaFiltro = [];

        if (value.length === 0) {
            return tabelaFiltro = this.state.pontosTuristicosFiltro;
        }

        for (let i = 0; i < data.length; i++) {
            value = value.toLowerCase();
            let nome = data[i].nome.toLowerCase();
            let descricao = data[i].descricao.toLowerCase();
            let cidade = data[i].cidade.toLowerCase();
            let estado = data[i].estado.toLowerCase();
            if (nome.includes(value)) {
                tabelaFiltro.push(data[i]);
            }
            if (descricao.includes(value)) {
                tabelaFiltro.push(data[i]);
            }
            if (cidade.includes(value)) {
                tabelaFiltro.push(data[i]);
            }
            if (estado.includes(value)) {
                tabelaFiltro.push(data[i]);
            }
        }

        if (tabelaFiltro.length <= 0) {
            tabelaFiltro = this.state.pontosTuristicosFiltro;
        } else {
            tabelaFiltro = this.removeRegistroDuplicado(tabelaFiltro);
        }
        return tabelaFiltro;
    }

    removeRegistroDuplicado = (tabelaFiltro) => {
        let unique = [];
        tabelaFiltro.forEach(elmento => {
            if (!unique.includes(elmento)) {
                unique.push(elmento);
            }
        });
        return unique;
    }

    renderTabela() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Referência</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.pontosTuristicos.map((pontoTuristico) =>
                            <tr key={pontoTuristico.idPontoTuristico}>
                                <td>{pontoTuristico.nome}</td>
                                <td>{pontoTuristico.descricao}</td>
                                <td>{pontoTuristico.cidade}</td>
                                <td>{pontoTuristico.estado}</td>
                                <td>{pontoTuristico.referencia}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => this.carregarDadosPontoTuristico(pontoTuristico.idPontoTuristico)}>Atualizar</Button>
                                    <Button variant="danger" onClick={() => this.deletarPontoTuristico(pontoTuristico.idPontoTuristico)}>Excluir</Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <div>
                <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>DADOS DO PONTO TURÍSTICO</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>NOME</Form.Label>
                                <Form.Control id="txtNome" type="text" maxLength={100} placeholder="INFORME O NOME" value={this.state.nome} onChange={this.atualizarNome} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>DESCRIÇÃO</Form.Label>
                                <Form.Control id="txtDescricao" type="text" maxLength={100} placeholder="INFORME A DESCRIÇÃO" value={this.state.descricao} onChange={this.atualizarDescricao} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="ddlEstado">Estado</Form.Label>
                                <Form.Select id="ddlEstado" value={this.state.idEstado} onChange={this.atualizarIdEstado}>
                                    <option value="0" required>SELECIONE UM ESTADO</option>
                                    {this.state.estados.map((estado) => {
                                        const { idEstado, descricao } = estado;
                                        return (<option key={idEstado} value={idEstado}>{descricao}</option>)
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="ddlCidade">Cidade</Form.Label>
                                <Form.Select id="ddlCidade" value={this.state.idCidade} onChange={this.atualizarIdCidade}>
                                    <option value="0" required>SELECIONE UMA CIDADE</option>
                                    {this.state.cidades.map((cidade) => {
                                        const { idCidade, descricao } = cidade;
                                        return (<option key={idCidade} value={idCidade}>{descricao}</option>)
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="txtReferencia">
                                <Form.Label>REFERÊNCIA</Form.Label>
                                <Form.Control as="textarea" rows={3} maxLength={100} placeholder="INFORME A REFERÊNCIA" value={this.state.referencia} onChange={this.atualizarReferencia} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.fecharModal}>Fechar</Button>
                        <Button variant="primary" type="submit" onClick={this.submit}>Salvar</Button>
                    </Modal.Footer>
                </Modal>
                <Button variant="warning" type="submit" onClick={this.reset}>Novo</Button>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control placeholder="FILTRO" onChange={this.filtroPontoTuristico}
                    />
                </InputGroup>
                {this.renderTabela()}
            </div>
        )
    }
}

export default PontosTuristicos;