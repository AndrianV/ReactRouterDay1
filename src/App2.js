import React from "react";
import { BrowserRouter as Router, Route, Link, NavLink, Switch, Prompt, Redirect } from "react-router-dom";

class AddBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = { book: { title: "", info: "" }, isDirty: false };
    }
    onSave = (e) => {
        e.preventDefault();
        this.props.bookStore.addBook(this.state.book);
        this.props.onAddBook();
        this.setState({ book: { title: "", info: "" }, isDirty: false });
        // alert('Book with this Title: "' + this.state.book.title +'" ,and this Info: "'+ this.state.book.info + '" was added!');
    }
    onChange = (e) => {
        e.preventDefault();
        this.setState({ book: { title: document.forms["addBookForm"]["title"].value, info: document.forms["addBookForm"]["info"].value }, isDirty: true });
    }
    render() {
        return (
            <div>
                <form name="addBookForm" onSubmit={this.onSave}>
                    Title: <input type="text" name="title" value={this.state.book.title} onChange={this.onChange} />
                    Info: <input type="text" name="info" value={this.state.book.info} onChange={this.onChange} />
                    <button>Save</button>
                </form>
                <Prompt when={this.state.isDirty} message="You have unsaved data that will be lost!" />
            </div>
        )
    }
}

class DeleteBook extends React.Component {
    onDelete = () => {
        this.props.bookStore.deleteBook(this.props.bookID);
        this.props.onDeleteBook();
        console.log("happen?");
    }
    render() {
        return (
            <div style={{ width: 100, textAlign: "center", padding: 5 }}>
                <button onClick={this.onDelete} style={{ backgroundColor: "#F6565A", color: "white", textDecoration: "none", borderColor: "#FFF", borderLeft: 5 }} >Delete this Book</button>
                <p>Do not use this button, because it will delete the book with the right ID, but will not render the Product due to not enough knowledge how to do it !</p>
            </div>
        )
    }
}

//Views start
const Home = () => (
    <div>
        <h2>Home View</h2>
        <p>Info about this site</p>
    </div>
)

const Company = () => {
    return (
        <div>
            <h2>About Us</h2>
            <p>Our about page</p>
        </div>
    )
}
class Product extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
        this.state = { bookStore: props.bookStore }
    }

    onBookWasAdded = () => {
        //Nice and easy way to force a rerender
        this.forceUpdate();
    }
    onBookWasDeleted = () => {
        //Force it again when a book was deleted from the BookStore inside bookstore.js
        this.forceUpdate();
    }
    render() {
        const books = this.state.bookStore.books;
        let bookStore = this.state.bookStore;
        const match = this.props.match;
        return (<div>
            <h2>Our Products</h2>
            <h4>All our great books </h4>
            <ul>
                {books.map((book) => <li key={book.id}>
                    <NavLink activeClassName="activeV2"
                        to={`${match.url}/detail/${book.id}`}>{book.title}</NavLink></li>)}
            </ul>
            <Link to={`${match.url}/add`}>Add book</Link>

            <div style={{ backgroundColor: "lightGray", padding: 5, marginTop: 10 }}>
                <Route path={`${match.url}/add`} render={(props) => <AddBook bookStore={bookStore}
                    onAddBook={this.onBookWasAdded} />} />
                <Route path={`${match.url}/detail/:id`} render={(props) => {
                    return (<Details {...props} onDeleteBook={this.onBookWasDeleted} bookStore={bookStore} />)
                }} />
            </div>
        </div>)
    }
}
//Views end

class Details extends React.Component {
    render() {
        let id = this.props.match.params.id;
        const match = this.props.match;
        let book = this.props.bookStore.books.filter((book) => {
            return book.id === Number(id);
        })[0];
        return (
            <div style={{ padding: 4 }}>
                <h4 style={{ color: "steelblue" }}>Detailed info for the title: {book.title}</h4>
                <p>Info: {book.info}</p>
                <Route path={`${match.url}`} render={(props) => <DeleteBook bookStore={this.props.bookStore} onDeleteBook={this.props.onDeleteBook} bookID={id} />} />
                <br />
                <Link to="/products">Products</Link>
                <br />
            </div>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
            <div>
                <ul className="header">
                    <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
                    <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
                    <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
                </ul>
            </div>
        );
    }
}

export default class App2 extends React.Component {
    render() {
        return (
            <Router >
                <div>
                    <Header />
                    <Switch>
                        <Route path="/products" render={(props) => (<Product {...props} bookStore={this.props.bookStore} />)} />
                        <Route path="/company" component={Company} />
                        <Route component={Home}></Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}