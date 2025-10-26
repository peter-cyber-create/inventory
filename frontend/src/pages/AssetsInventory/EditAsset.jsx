import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../helpers/api";
import FNSpinner from '../../components/FNSpinner'

const EditAsset = ({ close, refresh, id }) => {
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [category, setCategory] = useState([]);
    const [thematic, setThematic] = useState([]);
    const [thematicAreaId, setThematicAreaID] = useState("");
    const [legalCategoryId, setLegalCategoryId] = useState("");

    const [loading, setLoading] = useState(false)

    const categoryId = parseInt(legalCategoryId, 10);
    const thematicId = parseInt(thematicAreaId, 10);

    const getLaw = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/legal/${id}`);
            setLoading(false);
            setName(res.data.name);
            setDetail(res.data.detail);
            setLegalCategoryId(res.data.legalCategory.id);
            setThematicAreaID(res.data.thematicArea.id);
        } catch (error) {
            setLoading(false);
        }
    };

    const loadCategory = async () => {
        setLoading(true);
        try {
            const res = await API.get("/legal/category/all");
            setCategory(res.data);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const loadTheme = async () => {
        setLoading(true);
        try {
            const res = await API.get("/theme/all");
            setThematic(res.data);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name,
            detail,
            legalCategoryId: categoryId,
            thematicAreaId: thematicId
        }

        try {
            const response = await API.post("/legal/create", data);
            setLoading(false);
            setName("");
            setDetail("");
            setLegalCategoryId("");
            setThematicAreaID("");
            close();
            refresh();
            toast.success(`Law Successfully Added`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Law");
        }
    };

    useEffect(() => {
        loadCategory();
        loadTheme();
        getLaw();
    }, []);

    return (
        <div>
            <form class="forms-sample">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" autocomplete="off" placeholder="Law"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" rows="3" placeholder="Enter Description"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    ></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Select Category</label>
                    <select class="form-select" aria-label="Select example"
                        value={legalCategoryId} onChange={(e) => setLegalCategoryId(e.target.value)}>
                        <option>Select Legal Category</option>
                        {category.length > 0 &&
                            category.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Thematic Area</label>
                    <select class="form-select" aria-label="Select example"
                        value={thematicAreaId} onChange={(e) => setThematicAreaID(e.target.value)}>
                        <option>Select Thematic Area</option>
                        {thematic.length > 0 &&
                            thematic.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </select>
                </div>
                <button type="submit" class="btn btn-primary me-2" onClick={handleSubmit}>
                    {loading ? <FNSpinner /> : "Update Law"}
                </button>
                <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
            </form>
        </div>
    )
}

export default EditAsset