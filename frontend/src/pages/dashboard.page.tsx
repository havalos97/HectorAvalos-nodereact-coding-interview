import React, { FC, useState, useRef, useEffect, useMemo } from "react";

import { RouteComponentProps } from "@reach/router";
import { IUserProps } from "../dtos/user.dto";
import { UserCard } from "../components/users/user-card";
import { CircularProgress } from "@mui/material";

import { BackendClient } from "../clients/backend.client";

const backendClient = new BackendClient();

export const DashboardPage: FC<RouteComponentProps> = () => {
  const [userList, setUserList] = useState<IUserProps[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await backendClient.getAllUsers();
      setUserList(result.data)
      setLoading(false)
    };

    fetchData();
  }, []);

  const filteredUserList = useMemo(() => {
    return filter !== '' && filter !== null ? userList.filter((user) => {
      return user.first_name.toLowerCase().includes(filter)
    }) : userList
  }, [filter, userList])

  const paginatedList = useMemo(() => {
    console.log(filteredUserList)
    return filteredUserList.slice((page - 1) * 5, (page * 5))
  }, [page, filteredUserList])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUserList.length / 5)
  }, [filteredUserList])

  return (
    <div style={{ paddingTop: "30px" }}>
      <input type="text" onChange={(e) => setFilter(e.target.value)} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress size="60px" />
          </div>
        ) : (
          <div>
            {paginatedList.length
              ? paginatedList.map((user) => {
                  return <UserCard key={user.id} {...user} />;
                })
              : null}
          </div>
        )}
      </div>
      <button onClick={() => setPage(page - 1)} disabled={page <= 1}>Prev</button>
      <div>Page {page} of {totalPages}</div>
      <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
    </div>
  );
};
