import React, { useRef, useState, useEffect } from "react";
import { Link, withRouter, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import CKEditors from "react-ckeditor-component";

import { userActions } from "../../../redux/actions/user.actions";
import Loader from "../../common/Loader.jsx";
import api from "../../../helper/Api";

const AddEditPoem = (props) => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [poemType, setPoemType] = useState("ADD");

  const [poem, setPoem] = useState({
    id: "",
    poemNumber: "",
    title: "",
  });

  const [editor, setEditor] = useState({
    description: "",
  });

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (pathname.includes("/add-poem")) {
      setPoemType("ADD");
      setLoading(false);
    } else if (pathname.includes("/edit-poem")) {
      setPoemType("EDIT");
      api.get(`/cms/poem/details-by-id?id=${props.match.params.id}`).then((res) => {
        if (res.status === 200) {
          setPoem(res.data.data);
          setEditor(res.data.data);
          setLoading(false);
        }
      });
    }
  }, []);

  const validator = useRef(
    new SimpleReactValidator({
      className: "form-error",
    })
  );

  const handleTextChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setPoem({ ...poem, [name]: value });
  };

  const onEditorChange = (event, name) => {
    setEditor({ [name]: event.editor.getData() });
  };

  useEffect(() => {
    let description = editor?.description;
    setPoem({ ...poem, description });
  }, [editor]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validator.current.allValid()) {
      let fields = {};
      let api_path = "/cms/poem/create";
      let api_method = "post";

      if (poemType === "EDIT") {
        fields.id = props.match.params.id;
        api_path = "/cms/poem/edit";
        api_method = "put";
      } else if (poemType === "ADD") {
        fields.poemNumber = poem?.poemNumber;
      }

      fields.title = poem.title;
      fields.description = poem.description;

      api[api_method](api_path, { ...fields }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.message);
          props.history.push("/poem");
        } else {
          toast.error(res.message);
        }
      });
    } else {
      validator.current.showMessages();
      setForceUpdate(!forceUpdate);
    }
  };

  return (
    <div className="page-wrapper">
      {loading && <Loader />}

      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">
                {" "}
                {poemType && poemType === "EDIT" ? "Edit" : "Add"} Poem
              </h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/poem">Poems</Link>
                </li>
                <li className="breadcrumb-item active">
                  {poemType && poemType === "EDIT" ? "Edit" : "Add"} Poem
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body custom-edit-service">
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <div className="service-fields">
                    <div className="form-group">
                      <label>
                        Poem No. <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="poemNumber"
                        id="poemNumber"
                        value={poem?.poemNumber}
                        placeholder="Poem No."
                        onChange={handleTextChange}
                        disabled={poemType === "EDIT" && true}
                        onBlur={() =>
                          validator.current.showMessageFor("poemNumber")
                        }
                      />
                      {validator.current.message(
                        "poemNumber",
                        poem.poemNumber,
                        `required`
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        Poem Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="title"
                        value={poem?.title}
                        placeholder="Poem Title"
                        onChange={handleTextChange}
                        onBlur={() => validator.current.showMessageFor("title")}
                      />
                      {validator.current.message(
                        "title",
                        poem.title,
                        `required`
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        Poem Description <span className="text-danger">*</span>
                      </label>
                      <CKEditors
                        name="description"
                        content={editor?.description}
                        events={{
                          change: (e) => onEditorChange(e, "description"),
                        }}
                      />
                      {validator.current.message(
                        "description",
                        editor?.description,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="submit-section">
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                    >
                      {poemType === "ADD" && "Add"}
                      {poemType === "EDIT" && "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.authentication.userData,
  token: state.authentication.token,
});

const mapDispatchToProps = {
  logout: userActions.logout,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddEditPoem)
);
